#
# This is a Plumber API. In RStudio 1.2 or newer you can run the API by
# clicking the 'Run API' button above.
#
# In RStudio 1.1 or older, see the Plumber documentation for details
# on running the API.
#
# Find out more about building APIs with Plumber here:
#
#    https://www.rplumber.io/
#

library(plumber)
library(tidyverse)
library(readr)
library(ggplot2)
library(feasts)
library(tsibble)
library(jsonlite)
library(fpp3)
library(base64enc)
library(urca)
library(lubridate)
library(randomForest)
library(xgboost)
library(forecast)

source("utils.R")

data_dictionary <- list(
  "86316A" = "data/CL_86316_A.csv",
  "86317B" = "data/CL_86317_B.csv",
  "86318T" = "data/CL_86318_T.csv",
  "25466X" = "data/RP_25466_X.csv",
  "25481Y" = "data/RP_25481_Y.csv",
  "25555T" = "data/RP_25555_T.csv",
  "HN43576" = "data/HN_43567.csv",
  "HN53842" = "data/HN_53842.csv",
  "HNP86142" = "data/HNP_86142.csv",
  "PZ68476" = "data/PZ_68476.csv"
)

#* @apiTitle Análisis y predicción de series temporales

#* @filter cors
cors <- function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Accept")
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list(status = "ok"))
  }
  plumber::forward()
}

#* Importa un CSV y devuelve un tsibble
#* @param filename La ruta del archivo
#* @get /import
function(filename) {
  data <- readr::read_csv(filename)
  tibble_to_tsibble(data)
}

#* Muestra los principales estadísticos de una serie temporal
#* @post /summary
function(req) {
  if (length(req$postBody) == 0 || req$postBody == "") {
    return(list(error = "No se han proporcionado datos"))
  }
  data <- jsonlite::fromJSON(req$postBody)
  if (is.data.frame(data)) {
    medida <- data[["MEDIDA"]]
    min <- min(medida, na.rm = TRUE)
    first_quartile <- quantile(medida, 0.25, na.rm = TRUE)
    median <- median(medida, na.rm = TRUE)
    mean <- mean(medida, na.rm = TRUE)
    third_quartile <- quantile(medida, 0.75, na.rm = TRUE)
    max <- max(medida, na.rm = TRUE)
    sd <- sd(medida, na.rm = TRUE)

    stats <- list(
      "Mínimo" = min,
      "Primer Cuartil" = first_quartile,
      "Mediana" = median,
      "Media" = mean,
      "Tercer Cuartil" = third_quartile,
      "Máximo" = max,
      "Desviación Estándar" = sd
    )
  } else {
    return(list(error = "Los datos proporcionados no son una lista compatible"))
  }

  stats
}

#* Devuelve la descomposición gráfica de los componentes de la serie temporal
#* y el reporte
#* @serializer unboxedJSON
#* @param sensor El sensor a descomponer
#* @get /decompose
function(sensor) {
  if (!sensor %in% names(data_dictionary)) {
    return(list(error = "El sensor no existe"))
  }
  data <- readr::read_csv(data_dictionary[[sensor]]) %>%
    tibble_to_tsibble()
  fit <- data %>%
    model(ETS(MEDIDA))
  componentes <- fit %>%
    components() %>%
    autoplot() +
    labs(title = "Componentes ETS")
  temp_file <- tempfile(fileext = ".png")
  ggsave(temp_file, plot = componentes, width = 7, height = 5, dpi = 300)
  graf_base64 <- base64enc::base64encode(temp_file)
  list(grafico = graf_base64, reporte = capture.output(fit %>% report()))
}

#* Devuelve el gráfico con las predicciones y el reporte
#* @serializer unboxedJSON
#* @param sensor El sensor
#* @get /forecast-ets
function(sensor) {
  if (!sensor %in% names(data_dictionary)) {
    return(list(error = "El sensor no existe"))
  }
  data_raw <- readr::read_csv(data_dictionary[[sensor]])
  data <- tibble_to_tsibble(data_raw) %>% select(Day, MEDIDA)

  # Dividir los datos en entrenamiento y prueba
  splitted_data <- split_data(data, 0.8)
  train_data <- splitted_data$train_data
  test_data <- splitted_data$test_data

  # Entrenar el modelo ETS con el conjunto de entrenamiento
  fit <- train_data %>%
    model(ETS(MEDIDA))

  # Predicciones sobre el conjunto de prueba
  forecast_ets <- fit %>%
    forecast(h = nrow(test_data))

  # Calcular métricas de precisión
  accuracy_ets <- accuracy(forecast_ets, test_data)

  # Gráfico de las predicciones y los datos reales
  forecast_plot <- autoplot(forecast_ets) +
    geom_line(
      data = train_data,
      aes(x = Day, y = MEDIDA, color = "Datos de Entrenamiento")
    ) +
    geom_line(
      data = test_data, aes(x = Day, y = MEDIDA, color = "Datos de Prueba")
    ) +
    labs(title = "Predicción ETS y Datos Reales", x = "Fecha", y = "Medida") +
    scale_color_manual(
      values = c(
        "Datos de Entrenamiento" = "black",
        "Datos de Prueba" = "blue",
        "Predicción" = "red"
      )
    )

  # Guardar el gráfico en un archivo temporal
  temp_file <- tempfile(fileext = ".png")
  ggsave(temp_file, plot = forecast_plot, width = 7, height = 5, dpi = 300)
  graf_base64 <- base64enc::base64encode(temp_file)
  list(grafico = graf_base64, reporte = capture.output(accuracy_ets))
}

#* Devuelve la diferenciación de la serie temporal y el reporte
#* @serializer unboxedJSON
#* @param sensor El sensor a diferenciar
#* @get /diff
function(sensor) {
  if (!sensor %in% names(data_dictionary)) {
    return(list(error = "El sensor no existe"))
  }
  data <- readr::read_csv(data_dictionary[[sensor]]) %>%
    tibble_to_tsibble()
  data_feat <- features(
    data,
    data$MEDIDA,
    c(unitroot_kpss, unitroot_ndiffs, unitroot_nsdiffs)
  )
  data_diff <- data %>%
    mutate(diff_medida = difference(MEDIDA, differences = data_feat$ndiffs))
  gg_tdispl <- gg_tsdisplay(data_diff, diff_medida, plot_type = "partial")
  temp_file <- tempfile(fileext = ".png")
  ggsave(temp_file, plot = gg_tdispl, width = 7, height = 5, dpi = 300)
  graf_base64 <- base64enc::base64encode(temp_file)
  list(
    grafico = graf_base64,
    reporte = capture.output(data_feat)
  )
}

#* Devuelve el gráfico con las predicciones ARIMA y su reporte
#* @serializer unboxedJSON
#* @param sensor El sensor a descomponer
#* @get /forecast-arima
function(sensor) {
  if (!sensor %in% names(data_dictionary)) {
    return(list(error = "El sensor no existe"))
  }

  data_raw <- readr::read_csv(data_dictionary[[sensor]])
  data <- tibble_to_tsibble(data_raw) %>% select(Day, MEDIDA)

  # Dividir los datos en entrenamiento y prueba
  splitted_data <- split_data(data, 0.8)
  train_data <- splitted_data$train_data
  test_data <- splitted_data$test_data

  # Entrenar el modelo ARIMA con el conjunto de entrenamiento
  fit <- train_data %>%
    model(ARIMA(MEDIDA, stepwise = FALSE, greedy = FALSE))

  # Predicciones sobre el conjunto de prueba
  forecast_arima <- fit %>%
    forecast(h = nrow(test_data))

  # Calcular métricas de precisión
  accuracy_arima <- accuracy(forecast_arima, test_data)

  # Gráfico de las predicciones y los datos reales
  forecast_plot <- autoplot(forecast_arima) +
    geom_line(
      data = train_data,
      aes(x = Day, y = MEDIDA, color = "Datos de Entrenamiento")
    ) +
    geom_line(
      data = test_data, aes(x = Day, y = MEDIDA, color = "Datos de Prueba")
    ) +
    labs(title = "Predicción ARIMA y Datos Reales", x = "Fecha", y = "Medida") +
    scale_color_manual(
      values = c(
        "Datos de Entrenamiento" = "black",
        "Datos de Prueba" = "blue",
        "Predicción" = "red"
      )
    )

  temp_file <- tempfile(fileext = ".png")
  ggsave(temp_file, plot = forecast_plot, width = 7, height = 5, dpi = 300)
  graf_base64 <- base64enc::base64encode(temp_file)
  list(
    grafico = graf_base64,
    reporte = capture.output(accuracy_arima)
  )
}

#* Devuelve el gráfico con 2 sensores combinados
#* @serializer unboxedJSON
#* @param sensor1 El sensor 1
#* @param sensor2 El sensor 2
#* @get /combine-sensors
function(sensor1, sensor2) {
  if (
    !sensor1 %in% names(data_dictionary) || !sensor2 %in% names(data_dictionary)
  ) {
    return(list(error = "Al menos uno de los sensores no existe"))
  }

  data1 <- readr::read_csv(data_dictionary[[sensor1]]) %>%
    tibble_to_tsibble()
  data2 <- readr::read_csv(data_dictionary[[sensor2]]) %>%
    tibble_to_tsibble()

  merged_data <- data1 %>%
    left_join(data2, by = "Day", suffix = c("", "_temp")) %>%
    tidyr::fill(dplyr::everything(), .direction = "down")

  merged_data
}

#* Devuelve el gráfico con las predicciones VAR
#* y el reporte
#* @serializer unboxedJSON
#* @param sensor1 El sensor a descomponer
#* @param sensor2 El sensor a descomponer
#* @get /forecast-var
function(sensor1, sensor2) {
  if (
    !sensor1 %in% names(data_dictionary) || !sensor2 %in% names(data_dictionary)
  ) {
    return(list(error = "Al menos uno de los sensores no existe"))
  }

  data1 <- readr::read_csv(data_dictionary[[sensor1]]) %>%
    tibble_to_tsibble()
  data2 <- readr::read_csv(data_dictionary[[sensor2]]) %>%
    tibble_to_tsibble()

  merged_data <- data1 %>%
    left_join(data2, by = "Day", suffix = c("", "_temp")) %>%
    tidyr::fill(dplyr::everything(), .direction = "downup")

  # Dividir los datos en entrenamiento y prueba
  splitted_data <- split_data(merged_data, 0.8)
  train_data <- splitted_data$train_data
  test_data <- splitted_data$test_data

  # Entrenar el modelo VAR con el conjunto de entrenamiento
  fit <- train_data %>%
    model(VAR(vars(MEDIDA, MEDIDA_temp)))

  # Predicciones sobre el conjunto de prueba
  pred <- fit %>%
    forecast(h = nrow(test_data))

  # Calcular métricas de precisión
  accuracy_var <- accuracy(pred, test_data)

  # Gráfico de las predicciones y los datos reales
  plt_pred <- pred %>%
    autoplot(merged_data) +
    facet_grid(vars(.response), scales = "free_y") +
    labs(title = "Predicción VAR y datos reales", x = "Fecha", y = "Medida")

  temp_file <- tempfile(fileext = ".png")
  ggsave(temp_file, plot = plt_pred, width = 7, height = 5, dpi = 300)
  graf_base64 <- base64enc::base64encode(temp_file)
  list(
    grafico = graf_base64,
    reporte = capture.output(accuracy_var)
  )
}

#* Devuelve la descomposición STL
#* @serializer unboxedJSON
#* @param sensor El sensor a descomponer
#* @get /stl-decomp
function(sensor) {
  if (!sensor %in% names(data_dictionary)) {
    return(list(error = "El sensor no existe"))
  }
  data <- readr::read_csv(data_dictionary[[sensor]]) %>%
    tibble_to_tsibble()

  data_stl <- data %>%
    model(STL(MEDIDA ~ trend() + season(window = "periodic"), robust = TRUE))

  decomp_plot <- data_stl %>%
    components() %>%
    autoplot() +
    labs(title = "Componentes STL")

  temp_file <- tempfile(fileext = ".png")
  ggsave(temp_file, plot = decomp_plot, width = 7, height = 5, dpi = 300)
  graf_base64 <- base64enc::base64encode(temp_file)
  list(
    grafico = graf_base64,
    reporte = capture.output(data %>% features(MEDIDA, feat_stl))
  )
}

#* Devuelve el gráfico con las predicciones Random Forest
#* y el reporte
#* @serializer unboxedJSON
#* @param sensor El sensor
#* @get /forecast-rf
function(sensor) {
  if (!sensor %in% names(data_dictionary)) {
    return(list(error = "El sensor no existe"))
  }

  data_ts <- readr::read_csv(data_dictionary[[sensor]]) %>%
    tibble_to_tsibble() %>%
    select(c(Day, MEDIDA))

  data <- data_ts %>%
    mutate(Year = year(Day), Month = month(Day), Day_of_month = day(Day)) %>%
    as_tibble() %>%
    select(-Day)

  # Dividir los datos en entrenamiento y prueba
  splitted_data <- split_data(data, 0.8)
  train_data <- splitted_data$train_data
  test_data <- splitted_data$test_data

  # Entrenar el modelo Random Forest con el conjunto de entrenamiento
  rf_model <- randomForest(MEDIDA ~ ., data = train_data)

  # Predicciones sobre el conjunto de prueba
  predictions <- predict(rf_model, test_data)

  # Calcular métricas de precisión
  accuracy_rf <- forecast::accuracy(predictions, test_data$MEDIDA)

  # Preparar los datos para el gráfico
  train_data <- train_data %>%
    mutate(Type = "Train")
  test_data <- test_data %>%
    mutate(Type = "Test")
  predictions_df <- data.frame(
    Year = test_data$Year,
    Month = test_data$Month,
    Day_of_month = test_data$Day_of_month,
    MEDIDA = predictions,
    Type = "Prediction"
  )

  # Crear tsibble para el gráfico
  plot_data <- bind_rows(
    train_data,
    test_data,
    predictions_df
  ) %>%
    mutate(
      Day = as.Date(paste(Year, Month, Day_of_month, sep = "-"))
    ) %>%
    as_tsibble(index = Day, key = Type)

  # Crear el gráfico
  plot_rf <- plot_data %>%
    autoplot(MEDIDA) +
    labs(title = "Predicción Random Forest y Datos Reales", x = "Fecha", y = "Medida") +
    scale_color_manual(values = c("Train" = "black", "Test" = "blue", "Prediction" = "red"))

  temp_file <- tempfile(fileext = ".png")
  ggsave(temp_file, plot = plot_rf, width = 7, height = 5, dpi = 300)
  graf_base64 <- base64enc::base64encode(temp_file)
  list(
    grafico = graf_base64,
    reporte = capture.output(accuracy_rf)
  )
}

#* Devuelve el gráfico con las predicciones Gradient Boosting
#* y el reporte
#* @serializer unboxedJSON
#* @param sensor El sensor
#* @get /forecast-gb
function(sensor) {
  if (!sensor %in% names(data_dictionary)) {
    return(list(error = "El sensor no existe"))
  }

  data <- readr::read_csv(data_dictionary[[sensor]]) %>%
    tibble_to_tsibble() %>%
    select(Day, MEDIDA)

  # Se descompone la fecha
  data <- data %>%
    mutate(
      year = year(Day),
      month = month(Day),
      day = day(Day)
    )

  # Se divide el dataset en entrenamiento y prueba
  data_splitted <- split_data(data, 0.8)
  train_data <- data_splitted$train_data
  test_data <- data_splitted$test_data

  # Se seleccionan las características y la variable objetivo del conjunto de entrenamiento
  X_train <- train_data[, c("year", "month", "day")] %>% as.matrix()
  y_train <- train_data$MEDIDA %>% as.numeric()

  # Se crea la matriz DMatrix
  dtrain <- xgb.DMatrix(data = X_train, label = y_train)

  # Se entrena el modelo
  model <- xgboost(data = dtrain, nrounds = 200)

  # Se seleccionan las características del conjunto de prueba
  X_test <- test_data[, c("year", "month", "day")] %>% as.matrix()

  # Se crea la matriz DMatrix
  dtest <- xgb.DMatrix(data = X_test)

  # Se realizan las predicciones
  y_pred <- predict(model, dtest)

  # Se calculan las métricas de precisión
  accuracy_xgboost <- forecast::accuracy(y_pred, test_data$MEDIDA)

  # Crear tsibbles para y_train, y_test y y_pred
  train_tsibble <- train_data %>%
    select(Day, MEDIDA) %>%
    mutate(type = "Entrenamiento") %>%
    as_tsibble(index = Day, key = type)

  test_tsibble <- test_data %>%
    select(Day, MEDIDA) %>%
    mutate(type = "Prueba") %>%
    as_tsibble(index = Day, key = type)

  pred_tsibble <- test_data %>%
    select(Day) %>%
    mutate(MEDIDA = y_pred, type = "Predicción") %>%
    as_tsibble(index = Day, key = type)

  plot_data <- bind_rows(train_tsibble, test_tsibble, pred_tsibble)

  # Se grafican los resultados
  p <- plot_data %>%
    autoplot(MEDIDA) +
    labs(title = "Predicción XGBoost y Datos Reales", x = "Fecha", y = "Medida") +
    scale_color_manual(
      values = c("Entrenamiento" = "black", "Prueba" = "blue", "Predicción" = "red")
    )

  temp_file <- tempfile(fileext = ".png")
  ggsave(temp_file, plot = p, width = 7, height = 5, dpi = 300)
  graf_base64 <- base64enc::base64encode(temp_file)
  list(
    grafico = graf_base64,
    reporte = capture.output(accuracy_xgboost)
  )
}

#* Devuelve el gráfico con las predicciones NNAR
#* y el reporte
#* @serializer unboxedJSON
#* @param sensor El sensor
#* @get /forecast-nnar
function(sensor) {
  if (!sensor %in% names(data_dictionary)) {
    return(list(error = "El sensor no existe"))
  }

  data_ts <- readr::read_csv(data_dictionary[[sensor]]) %>%
    tibble_to_tsibble() %>%
    select(Day, MEDIDA)

  # Dividir los datos en entrenamiento y prueba
  data_splitted <- split_data(data_ts, 0.8)
  train_data <- data_splitted$train_data
  test_data <- data_splitted$test_data

  # Entrenar el modelo NNETAR con el conjunto de entrenamiento
  fit <- train_data %>%
    model(NNETAR(MEDIDA))

  # Predicciones sobre el conjunto de prueba
  forecast_nnetar <- fit %>%
    forecast(h = nrow(test_data))

  # Calcular métricas de precisión
  accuracy_nnetar <- accuracy(forecast_nnetar, test_data)

  # Graficar las predicciones y los datos reales
  forecast_plot <- autoplot(forecast_nnetar) +
    geom_line(data = train_data, aes(x = Day, y = MEDIDA, color = "Entrenamiento")) +
    geom_line(data = test_data, aes(x = Day, y = MEDIDA, color = "Prueba")) +
    labs(title = "Predicción NNETAR y Datos Reales", x = "Fecha", y = "Medida") +
    scale_color_manual(values = c("Entrenamiento" = "black", "Prueba" = "blue", "Predicción" = "red"))

  temp_file <- tempfile(fileext = ".png")
  ggsave(temp_file, plot = forecast_plot, width = 7, height = 5, dpi = 300)
  graf_base64 <- base64enc::base64encode(temp_file)
  list(
    grafico = graf_base64,
    reporte = capture.output(accuracy_nnetar)
  )
}

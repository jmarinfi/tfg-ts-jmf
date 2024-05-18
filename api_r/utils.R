library(tidyverse)
library(tsibble)

regularize_freq <- function(tsibble_data) {
  # Calcular la diferencia en días entre fechas consecutivas
  diffs <- tsibble_data %>%
    mutate(
      diff_days = as.numeric(
        difftime(FECHA_MEDIDA, lag(FECHA_MEDIDA), units = "days")
      )
    ) %>%
    filter(!is.na(diff_days)) %>%
    pull(diff_days)

  # Calcular la frecuencia media
  avg_freq <- mean(diffs)

  if (avg_freq < 1) {
    # Si la frecuencia media es inferior a 1 día, reindexar a 1 fila diaria
    tsibble_regular <- tsibble_data %>%
      tsibble::index_by(Day = as.Date(FECHA_MEDIDA)) %>%
      dplyr::summarise(across(where(is.numeric), mean, na.rm = TRUE)) %>%
      tsibble::fill_gaps(.full = TRUE) %>%
      tidyr::fill(dplyr::everything(), .direction = "down")
  } else {
    # Si la frecuencia media es superior a 1 día, reindexar a 1 fila semanal
    tsibble_regular <- tsibble_data %>%
      tsibble::index_by(Day = yearweek(FECHA_MEDIDA) %>% as.Date()) %>%
      dplyr::summarise(across(where(is.numeric), mean, na.rm = TRUE)) %>%
      tsibble::fill_gaps(.full = TRUE) %>%
      tidyr::fill(dplyr::everything(), .direction = "down")
  }

  return(tsibble_regular)
}

tibble_to_tsibble <- function(tibble_data) {
  tsibble_data <- tibble_data %>%
    arrange(FECHA_MEDIDA) %>%
    tsibble::tsibble(key = ID_SENSOR, index = FECHA_MEDIDA) %>%
    tsibble::group_by_key()
  tsibble_regular <- regularize_freq(tsibble_data)

  return(tsibble_regular)
}

split_data <- function(data, split_point = 0.8) {
  split_point <- floor(nrow(data) * split_point)
  train_data <- data[1:split_point, ]
  test_data <- data[(split_point + 1):nrow(data), ]
  return(list(train_data = train_data, test_data = test_data))
}

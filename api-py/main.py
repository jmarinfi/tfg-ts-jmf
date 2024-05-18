import io
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, GRU, SimpleRNN, Dropout, GRU, Bidirectional
from tensorflow.keras.optimizers import SGD
from tensorflow.random import set_seed

from utils import sensors_dictionary, preprocessing_data, prepare_train, build_model_simple_RNN, build_model_LSTM, get_model_summary, get_predictions, get_base64_plot

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.get("/forecast-rnn")
async def forecast_rnn(sensor: str = '25466X', model: str = "SimpleRNN"):
    if sensor not in sensors_dictionary:
        return {"error": f"Sensor {sensor} no existe"}
    if model not in ["SimpleRNN", "LSTM"]:
        return {"error": f"Modelo {model} no existe"}

    set_seed(455)
    np.random.seed(455)

    data = preprocessing_data(sensor)

    split_index = int(len(data) * 0.8)
    training_set = data.iloc[:split_index].values
    test_set = data.iloc[split_index:].values

    n_steps = 60
    n_features = 1

    sc = StandardScaler()
    X_train, y_train = prepare_train(training_set, sc, n_steps, n_features)

    model_rnn = build_model_simple_RNN(
        units=125, epochs=10, n_steps=n_steps, n_features=n_features, X_train=X_train, y_train=y_train
    ) if model == "SimpleRNN" else build_model_LSTM(
        units=125, epochs=10, n_steps=n_steps, n_features=n_features, X_train=X_train, y_train=y_train
    )

    predictions = get_predictions(dataset=data, model=model_rnn, test_set=test_set, n_steps=n_steps, n_features=n_features, scaler=sc)

    mae = mean_absolute_error(test_set, predictions)
    mse = mean_squared_error(test_set, predictions)
    rmse = np.sqrt(mse)

    grafic_pred_b64 = get_base64_plot(
        {
            'x': np.arange(len(training_set)),
            'y': training_set,
        },
        {
            'x': np.arange(len(training_set), len(training_set) + len(test_set)),
            'y': test_set,
        },
        {
            'x': np.arange(len(training_set), len(training_set) + len(predictions)),
            'y': predictions,
        },
        model,
        plt,
        io.BytesIO()
    )
    plt.close()

    return {
        "reporte": [f'MAE: {mae}', f'MSE: {mse}', f'RMSE: {rmse}'],
        "grafico": grafic_pred_b64,
    }

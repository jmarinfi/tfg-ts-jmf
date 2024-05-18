import base64
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sys
from io import StringIO

from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, GRU, SimpleRNN, Dropout, GRU, Bidirectional
from tensorflow.keras.optimizers import SGD
from tensorflow.random import set_seed

sensors_dictionary = {
    '86316A': 'data/CL_86316_A.csv',
    '86317B': 'data/CL_86317_B.csv',
    '86318T': 'data/CL_86318_T.csv',
    '25466X': 'data/RP_25466_X.csv',
    '25481Y': 'data/RP_25481_Y.csv',
    '25555T': 'data/RP_25555_T.csv',
    'HN43576': 'data/HN_43567.csv',
    'HN53842': 'data/HN_53842.csv',
    'HNP86142': 'data/HNP_86142.csv',
    'PZ68476': 'data/PZ_68476.csv'
}


def preprocessing_data(sensor, sensors_dictionary=sensors_dictionary):
    # Cargar el dataset
    data = pd.read_csv(sensors_dictionary[sensor])
    # Descartar las columnas 'LECTURA' e 'ID_SENSOR'
    data_cleaned = data.drop(columns=['LECTURA', 'ID_SENSOR'])
    # Convertir la columna de fecha en tipo datetime
    data_cleaned['FECHA_MEDIDA'] = pd.to_datetime(data_cleaned['FECHA_MEDIDA'])
    # Establecer la fecha como índice del dataframe
    data_indexed = data_cleaned.set_index('FECHA_MEDIDA')
    # Regularizar la serie temporal con una frecuencia de 5 minutos
    # data_regular = data_indexed.asfreq('5min', method='pad')
    data_regular = data_indexed.resample('D').mean().fillna(method='ffill')
    return data_regular


def split_sequence(sequence, n_steps):
    X, y = list(), list()
    for i in range(len(sequence)):
        end_ix = i + n_steps
        if end_ix > len(sequence) - 1:
            break
        seq_x, seq_y = sequence[i:end_ix], sequence[end_ix]
        X.append(seq_x)
        y.append(seq_y)
    return np.array(X), np.array(y)


def prepare_train(training_set, scaler, n_steps, n_features=1):
    training_set = training_set.reshape(-1, 1)
    training_set_scaled = scaler.fit_transform(training_set)
    X_train, y_train = split_sequence(training_set_scaled, n_steps)
    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], n_features)
    return X_train, y_train


def build_model_simple_RNN(units, epochs, n_steps, n_features, X_train, y_train):
    model = Sequential()
    model.add(SimpleRNN(units=units, activation='tanh', input_shape=(n_steps, n_features)))
    model.add(Dense(1))
    # Compilar el modelo
    model.compile(optimizer='RMSprop', loss='mse')
    # Entrenar el modelo
    model.fit(X_train, y_train, epochs=epochs, batch_size=32)
    return model


def build_model_LSTM(units, epochs, n_steps, n_features, X_train, y_train):
    model = Sequential()
    model.add(LSTM(units=units, activation='tanh', input_shape=(n_steps, n_features)))
    model.add(Dense(1))
    # Compilar el modelo
    model.compile(optimizer='RMSprop', loss='mse')
    # Entrenar el modelo
    model.fit(X_train, y_train, epochs=epochs, batch_size=32)
    return model


def get_model_summary(model):
    old_stdout = sys.stdout
    sys.stdout = buffer = StringIO()
    model.summary()
    sys.stdout = old_stdout
    summary = buffer.getvalue()
    buffer.close()
    return summary


def get_predictions(dataset, model, test_set,n_steps, n_features, scaler):
    dataset_total = dataset.loc[:, 'MEDIDA']
    inputs = dataset_total[len(dataset_total) - len(test_set) - n_steps:].values
    inputs = inputs.reshape(-1, 1)
    inputs = scaler.transform(inputs)

    X_test, y_test = split_sequence(inputs, n_steps)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], n_features)

    predictions = model.predict(X_test)
    predictions = scaler.inverse_transform(predictions)
    return predictions

def get_base64_plot(training_data, test_data, predictions, model, plt_object, buffer):
    plt_object.plot(training_data['x'], training_data['y'], color='blue', label='Entrenamiento')
    plt_object.plot(test_data['x'], test_data['y'], color='gray', label='Real')
    plt_object.plot(predictions['x'], predictions['y'], color='red', label='Predicciones')
    plt_object.title(f'Predicciones {model} vs Datos Reales')
    plt_object.xlabel('Tiempo')
    plt_object.ylabel('Medida')
    plt_object.legend()
    plt_object.tight_layout()
    
    plt_object.savefig(buffer, format='png')
    buffer.seek(0)
    graf_base64 = base64.b64encode(buffer.read()).decode('utf-8')

    return graf_base64
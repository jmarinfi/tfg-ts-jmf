FROM rstudio/plumber
LABEL maintainer="jmarinfi@uoc.edu"

COPY . /app
WORKDIR /app

RUN R -e "install.packages('tidyverse')"
RUN R -e "install.packages('readr')"
RUN R -e "install.packages('ggplot2')"
RUN R -e "install.packages('feasts')"
RUN R -e "install.packages('tsibble')"
RUN R -e "install.packages('jsonlite')"
RUN R -e "install.packages('fpp3')"
RUN R -e "install.packages('base64enc')"
RUN R -e "install.packages('urca')"
RUN R -e "install.packages('lubridate')"
RUN R -e "install.packages('randomForest')"
RUN R -e "install.packages('xgboost')"
RUN R -e "install.packages('forecast')"

CMD ["/app/plumber.R"]

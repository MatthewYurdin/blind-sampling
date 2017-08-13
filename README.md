# Tools for Handling Blind Sampling of Sub-groups of Iterest

## Background

Ideally, when a survey sampling problem is concerned with a particular subpopulation, that group can be oversampled or only-sampled. But sometimes we cannot identify who is in the subpopulation at the time the sample is drawn. In these cases there will invevitably be some amount of waste collecting unnecessary data. This repo includes various tools for simulations and estimates tied to hypothetical subgroups making up various proportions of the population (e.g., 1%, 5%, 10%, etc.). I hope these tools will be useful for explaining these problems and for planning blind samples with the minimum of wasted sample.

## samplex.js

samplex.js keeps a private log accessible with these functions:

- `show_log()` prints the full log to the console's log.

- `download()` saves the log as a .txt file. This function is also used for downloading datasets. The default argument will get you a log; a dataset ID (explained below) a data file in whatever format is in `SETTINGS.OUTPUT_FORMAT`.

For running simulations:

- `simulate_sampling_distribution()`


Datasets can be printed to the console as JSON or downloaded as whatever's in `SETTINGS.OUTPUT_FORMAT`.

- `show_data(*dataset_ID*)` prints the data to the console. Every dataset is assigned a unique 7-character ID. You can find the ID by using `show_log()`. The dataset ID is also printed to the console after any simulation.

- `download(*dataset_ID*)`

Settings can be checked or edited with:

- `settings()` will print the current settings to the console.

- `settings(*setting*) will print the current value for just one setting.

- `settings(*setting*, *value*) will update the specified setting to *value*.

## sampro.py


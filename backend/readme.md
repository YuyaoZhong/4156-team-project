# Time Management

## Setting up the deveopment environment
Install required packages

```
pip install -r requirements.txt 
```

If new package is add, run
```
pip freeze > requirements.txt 
```



## Generate reports

Use the following command to generate .html reports

```
pylint --rcfile=.pylintrc app tests  run runTests | pylint-json2html -o pylint_report_1.html
```
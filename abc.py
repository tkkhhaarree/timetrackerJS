import datetime

print(
    str(datetime.datetime.now().hour)
    + "-"
    + str(datetime.date.today().day)
    + "/"
    + str(datetime.date.today().month)
    + "/"
    + str(datetime.date.today().year)
)

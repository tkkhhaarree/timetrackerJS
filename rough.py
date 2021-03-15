import subprocess
from win32gui import GetForegroundWindow
import psutil
import time
import win32process
import requests
import json
from tkinter import *
import threading
import datetime
import logging


current_app = psutil.Process(win32process.GetWindowThreadProcessId(GetForegroundWindow())[1]).name().replace(".exe", "")

running_list = []
cmd = 'powershell "gps | where {$_.MainWindowTitle } | select ProcessName'
proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
for line in proc.stdout:
    running_list.append(line.decode().rstrip())

print("current app: ", current_app)
print("running list: ", running_list)            
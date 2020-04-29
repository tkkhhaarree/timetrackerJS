import subprocess
from win32gui import GetForegroundWindow
import psutil
import time
import win32process
import requests
import json


chrome_flag = 0
# 1 if chrome is open (both minimize and maximize), 0 if not opened or quit.

chrome_minimized = 0  # 0 if chrome restored  or closed, 1 if minimized.
session_aqquired = 0  # 0 if not opened or quit, 1 if opened.
chrome_quit = 0  # 1 if quit, 0 if opened or minimized.

email = "abcd@gmail.com"
password = "123456"
auth = ""
session = "NA"
process_time = {}
time.sleep(10)
ticket = 0  # 1 if server is up.

save_counter = 0
try:
    response = requests.post(
        "http://127.0.0.1:5000/userauth/login",
        data=json.dumps({"email": email, "password": password}),
        headers={"Content-Type": "application/json"},
    )

    auth = json.loads(response.text)["token"]

    print("auth text: " + auth)
    ticket = 1

except:
    print("url tracker server down1")

while ticket == 1:
    current_app = ""
    init = time.time()
    try:
        current_app = (
            psutil.Process(
                win32process.GetWindowThreadProcessId(GetForegroundWindow())[1]
            )
            .name()
            .replace(".exe", "")
        )
    except:
        continue

    # when chrome has been opened fresh.
    if current_app == "chrome" and chrome_flag == 0 and session_aqquired == 0:
        chrome_flag = 1
        print("offset: ", int(time.timezone / 60))
        s = requests.post(
            "http://127.0.0.1:5000/usersession/get_app_session",
            data=json.dumps({"timezone_offset": int(time.timezone / 60)}),
            headers={"x-auth-token": auth, "Content-Type": "application/json"},
        )
        session = json.loads(s.text)["session"]
        print("chrome opened with session: " + str(session))
        session_aqquired = 1
        chrome_minimized = 0
        chrome_quit = 0

    running_list = []
    cmd = 'powershell "gps | where {$_.MainWindowTitle } | select ProcessName'
    proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    for line in proc.stdout:
        running_list.append(line.decode().rstrip())

    # when chrome has been quit.
    if (
        current_app != "chrome"
        and "chrome" not in running_list
        and "chrome" in process_time.keys()
        and chrome_quit == 0
        and session_aqquired == 1
        and chrome_flag == 1
    ):
        chrome_flag = 0
        chrome_minimized = 0
        session_aqquired = 0
        chrome_quit = 1
        try:
            print("chrome has been quit.")
            resp = requests.post(
                "http://127.0.0.1:5000/urltrack/quit_chrome",
                data=json.dumps({"session": session}),
                headers={"x-auth-token": auth, "Content-Type": "application/json"},
            )
            print(resp.text)

        except:
            print("server down52")
            continue

    # when chrome minimized.
    if (
        current_app != "chrome"
        and chrome_flag == 1
        and chrome_minimized == 0
        and session_aqquired == 1
    ):
        print("chrome minimized")
        chrome_minimized = 1
        resp = requests.post(
            "http://127.0.0.1:5000/urltrack/quit_chrome",
            data=json.dumps({"session": session}),
            headers={"x-auth-token": auth, "Content-Type": "application/json"},
        )
        print(resp.text)

    # chrome restored after minimize.
    if (
        current_app == "chrome"
        and chrome_flag == 1
        and chrome_minimized == 1
        and session_aqquired == 1
    ):
        print("chrome restored.")
        resp = requests.post(
            "http://127.0.0.1:5000/urltrack/restore_chrome",
            data=json.dumps({"session": session}),
            headers={"x-auth-token": auth, "Content-Type": "application/json"},
        )
        print(resp.text)
        chrome_minimized = 0

    if current_app not in process_time.keys():
        process_time[current_app] = 0
    final = time.time()
    process_time[current_app] += int(final - init)
    save_counter = save_counter + 1
    if save_counter == 10:
        try:
            save_resp = requests.post(
                "http://127.0.0.1:5000/urltrack/save_app",
                data=json.dumps({"session": session, "apptime": process_time}),
                headers={"x-auth-token": auth, "Content-Type": "application/json"},
            )
            print(save_resp.text)
            print(process_time)
            save_counter = 0
        except:
            print("server down")
            save_counter = save_counter - 1

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


logging.basicConfig(filename='example.log', level=logging.DEBUG)


def btnClick():
    global th
    th = threading.Thread(target=signIn)
    th.start()


def onClose():
    global stop, th, login_screen
    stop = 1
    login_screen.destroy()


def logout():
    global ticket, logout_button, login_button, status_text, login_screen, th
    ticket = 0
    logout_button.pack_forget()
    login_button.pack()
    login_screen.update()
    status_text["text"] = "Logout Success."


def signIn():
    chrome_flag = 0
    # 1 if chrome is open (both minimize and maximize), 0 if not opened or quit.

    chrome_minimized = 0  # 0 if chrome restored  or closed, 1 if minimized.
    session_aqquired = 0  # 0 if not aqquired, 1 if aqquired.
    chrome_quit = 0  # 1 if quit, 0 if opened or minimized.

    global username_login_entry
    global password_login_entry
    global login_button, logout_button
    global status_text
    global login_screen
    global stop, ticket, th

    email = username_login_entry.get()
    password = password_login_entry.get()
    print(email)
    auth = ""
    session = "NA"
    process_time = {}
    # 1 if server is up.

    save_counter = 0
    try:
        response = requests.post(
            "https://clockman.herokuapp.com/userauth/login",
            data=json.dumps({"email": email, "password": password}),
            headers={"Content-Type": "application/json"},
        )

        auth = json.loads(response.text)["token"]

        print("auth text: " + auth)
        ticket = 1
        login_button.pack_forget()
        logout_button.pack()
        login_screen.update()

        status_text["text"] = "Login Success!"

    except Exception as e:
        print("url tracker server down1")
        status_text["text"] = "Error logging in."
        ticket = 0
        logging.error(e)
    status_text.pack()

    print("offset: ", int(time.timezone / 60))
    s = requests.post(
        "https://clockman.herokuapp.com/usersession/get_app_session",
        data=json.dumps({"timezone_offset": int(time.timezone / 60)}),
        headers={"x-auth-token": auth, "Content-Type": "application/json"},
    )
    session = json.loads(s.text)["session"]
    process_time = json.loads(s.text)["appstats"]
    print("process time aqquired: ", process_time)
    print("clockman aqquired session: " + str(session))
    session_aqquired = 1

    while ticket == 1 and stop == 0 and session_aqquired == 1:

        x = (
            str(datetime.datetime.now().hour)
            + "-"
            + str(datetime.date.today().day)
            + "/"
            + str(datetime.date.today().month)
            + "/"
            + str(datetime.date.today().year)
        )

        if session != x:
            s = requests.post(
                "https://clockman.herokuapp.com/usersession/get_app_session",
                data=json.dumps({"timezone_offset": int(time.timezone / 60)}),
                headers={"x-auth-token": auth,
                         "Content-Type": "application/json"},
            )
            session = json.loads(s.text)["session"]
            process_time = json.loads(s.text)["appstats"]
            print("new session after hour change: " + session)

        current_app = ""
        init = time.time()
        try:
            current_app = (
                psutil.Process(
                    win32process.GetWindowThreadProcessId(
                        GetForegroundWindow())[1]
                )
                .name()
                .replace(".exe", "")
            )
        except:
            continue

        # when chrome has been opened fresh.
        if current_app == "chrome" and chrome_flag == 0:
            chrome_flag = 1
            chrome_minimized = 0
            chrome_quit = 0
            print("chrome opened with session: " + str(session))
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
            chrome_quit = 1
            try:
                print("chrome has been quit.")
                resp = requests.post(
                    "https://clockman.herokuapp.com/urltrack/quit_chrome",
                    data=json.dumps({"session": session}),
                    headers={"x-auth-token": auth,
                             "Content-Type": "application/json"},
                )
                print(resp.text)

            except:
                print("server down52")
                continue

        # when chrome minimized.
        if current_app != "chrome" and chrome_flag == 1 and chrome_minimized == 0:
            print("chrome minimized")
            chrome_minimized = 1
            resp = requests.post(
                "https://clockman.herokuapp.com/urltrack/quit_chrome",
                data=json.dumps({"session": session}),
                headers={"x-auth-token": auth,
                         "Content-Type": "application/json"},
            )
            print(resp.text)

        # chrome restored after minimize.
        if current_app == "chrome" and chrome_flag == 1 and chrome_minimized == 1:
            print("chrome restored.")
            resp = requests.post(
                "https://clockman.herokuapp.com/urltrack/restore_chrome",
                data=json.dumps({"session": session}),
                headers={"x-auth-token": auth,
                         "Content-Type": "application/json"},
            )
            print(resp.text)
            chrome_minimized = 0

        if current_app not in process_time.keys():
            process_time[current_app] = 0
        final = time.time()
        process_time[current_app] += int(final - init)
        save_counter = save_counter + 1
        # print("process time: ", process_time)
        # print("running processes: ", running_list)
        if save_counter == 10:
            try:
                save_resp = requests.post(
                    "https://clockman.herokuapp.com/urltrack/save_app",
                    data=json.dumps(
                        {"session": session, "apptime": process_time}),
                    headers={"x-auth-token": auth,
                             "Content-Type": "application/json"},
                )
                print(save_resp.text)
                print(process_time)
                save_counter = 0
            except:
                print("server down")
                save_counter = save_counter - 1


th = threading.Thread(target=signIn)
stop = 0
ticket = 0

login_screen = Tk()
login_screen.title("Clockman: Login")
login_screen.geometry("300x250")
Label(login_screen, text="Please enter login details").pack()
Label(login_screen, text="").pack()
Label(login_screen, text="Username").pack()
username_login_entry = Entry(login_screen, textvariable="username")
username_login_entry.pack()
Label(login_screen, text="").pack()
Label(login_screen, text="Password").pack()
password_login_entry = Entry(login_screen, textvariable="password", show="*")
password_login_entry.pack()
Label(login_screen, text="").pack()
login_button = Button(login_screen, text="Login",
                      width=10, height=1, command=btnClick)
status_text = Label(login_screen, text="")
logout_button = Button(login_screen, text="Logout",
                       width=10, height=1, command=logout)
login_button.pack()
login_screen.protocol("WM_DELETE_WINDOW", onClose)
login_screen.mainloop()

import cx_Freeze
import sys
import os
from multiprocessing import Queue
import idna.idnadata

base = None
if sys.platform == "win32":
    base = "Win32GUI"

executables = [cx_Freeze.Executable("app_tracker.py", base=base)]
os.environ['TCL_LIBRARY'] = "C:\\Python\\tcl\\tcl8.6"
os.environ['TK_LIBRARY'] = "C:\\Python\\tcl\\tk8.6"

cx_Freeze.setup(
    name="AppTracker",
    version="1.0",
    options={"build.exe": {"packages": ["subprocess", "win32gui", "psutil", "time",
                                        "win32process", "requests", "json", "tkinter", "threading", "datetime"]}},
    description="Track app time!",
    executables=executables
)

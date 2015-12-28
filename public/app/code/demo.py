"""
hellodrone.py:

Show how to connect to the dronekit

@author Geoff Gardner <geoff@skyworksas.com>
"""
from dronekit import connect
from dronekit.lib import VehicleMode
from pymavlink import mavutil
import time

CONNECT_INFO = '0.0.0.0:14550'

# Connect to the Vehicle
print "\nConnecting to vehicle on: %s" % CONNECT_INFO
vehicle = connect(CONNECT_INFO, wait_ready=True)

if vehicle.mode.name == "INITIALISING":
    print "Waiting for vehicle to initialise"
    time.sleep(1)

print "\nAccumulating vehicle attribute messages"
while vehicle.attitude.pitch==None:  #Attitude is fairly quick to propagate
    print " ..."
    time.sleep(1)

print " Set mode=STABILIZE (currently: %s)" % vehicle.mode.name
vehicle.mode = VehicleMode("STABILIZE")

time.sleep(2)


#Close vehicle object before exiting script
print "\nClose vehicle object"
vehicle.close()

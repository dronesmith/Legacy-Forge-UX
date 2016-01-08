"""
Show how to connect to the dronekit

@author Geoff
"""

import time

# Connect to the Vehicle
vehicle = connect(__SIMLY__, wait_ready=True)

if vehicle.mode.name == "INITIALIZING":
    print "Waiting for vehicle to initialize"
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

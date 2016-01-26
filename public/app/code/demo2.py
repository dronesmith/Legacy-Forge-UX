
import random
from time import *


# Connect to the Vehicle
vehicle = connect(__DRONE__, wait_ready=True)

print "Sending RGB Command"
sys.stdout.flush()

vehicle._rgbled.color((1.0, 0.0, 1.0))

vehicle._rgbled.pulse()
vehicle._rgbled.color((random.random(), random.random(), random.random()))
sleep(2)
vehicle._rgbled.pulse()
sleep(2)
vehicle._rgbled.color((random.random(), random.random(), random.random()))
sleep(2)
vehicle._rgbled.setDefault()

#Close vehicle object before exiting script
print "Close vehicle object"
sys.stdout.flush()
sleep(5)
vehicle.close()

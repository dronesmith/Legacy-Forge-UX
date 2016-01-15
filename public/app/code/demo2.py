import random
import time

#
#
# # Connect to the Vehicle
vehicle = connect(__DRONE__, wait_ready=True)

print "Sending RGB Command"

vehicle._rgbled.color((1.0, 0.0, 1.0))
while True:
    vehicle._rgbled.color((random.random(), random.random(), random.random()))
    time.sleep(1)
    vehicle._rgbled.on()
    time.sleep(1)
    vehicle._rgbled.off()

#Close vehicle object before exiting script
print "Close vehicle object"
sys.stdout.flush()
vehicle.close()

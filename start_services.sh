#!/bin/bash
cd packages/javascript/starterkit
echo "Attempting to start npm run dev completely detached..."
nohup npm run dev > /dev/null 2>&1 &
# Give it a few seconds to launch, then explicitly exit the script
sleep 5 
echo "Script finished, background process (nohup) should be running."
exit 0

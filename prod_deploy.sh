#!/usr/bin/env bash
# TODO: This needs to be replaced with proper puppet script
branch="master"

echo "######### {INFO} : Deploying for production... #########"
echo "######### {INFO} : Current GIT status #########"
git status
echo "######### {INFO} : Sync via GIT #########"
git pull origin ${branch}
echo "######### {INFO} : Webpack operation #########"
webpack --context ./map_system/static/map_system/local/libraries/  --config ./map_system/static/map_system/local/libraries/webpack.config.js
echo "######### {INFO} : Django collecting static files #########"
python3.5 manage.py collectstatic --noinput -i node_modules
echo "######### {INFO} : Restarting apache server #########"
sudo systemctl restart apache2.service
echo "######### {INFO} : Check for currently running server cores #########"
ps aux | grep -v grep | grep -i -e VSZ -e server
echo "######### {INFO} : All done... #########"
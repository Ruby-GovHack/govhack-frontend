#!/bin/bash

su -l docker -c "cd /code; grunt connect:dist:keepalive"

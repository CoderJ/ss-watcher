#!/bin/bash
netstat -na|grep ESTABLISHED|grep :443|awk '{print $4,$5}'
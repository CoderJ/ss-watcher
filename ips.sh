#!/bin/bash
netstat -na|grep ESTABLISHED|grep 443|awk '{print $5}'|awk -F: '{print $1}'
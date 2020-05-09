#!/bin/bash
netstat -na|grep ESTABLISHED|awk '{print $5}'|awk -F: '{print $1}'
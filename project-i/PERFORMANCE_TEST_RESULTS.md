# Performance test results

Brief description of the used server: HTTP/1.1 

Brief description of my computer:
  Model Name: DuYutong
  Model Identifier: x86_64
  Chip: AMD Ryzen 7 7840HS w/ Radeon 780M Graphics
  Total Number of Cores: 16
  Memory: 7.4Gi
  System Firmware Version: 5.15.167.4-microsoft-standard-WSL2
  OS Loader Version: #1 SMP Tue Nov 5 00:21:55 UTC 2024


## Fetch Assignment API

http_reqs: 30029 
http_req_duration - median: 2.75ms
http_req_duration - 99th percentile: 11.82ms 

     execution: local
        script: performance-test-fetch-assignment.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 40s max duration (incl. graceful stop):
              * default: 10 looping VUs for 10s (gracefulStop: 30s)

     data_received..............: 6.0 MB  600 kB/s
     data_sent..................: 2.9 MB  288 kB/s
     http_req_blocked...........: med=2.83µs  p(99)=29.6µs  
     http_req_connecting........: med=0s      p(99)=0s      
     http_req_duration..........: med=2.75ms  p(99)=11.82ms 
     http_req_failed............: 100.00% 30029 out of 30029
     http_req_receiving.........: med=40.56µs p(99)=349.06µs
     http_req_sending...........: med=8.67µs  p(99)=97.53µs 
     http_req_tls_handshaking...: med=0s      p(99)=0s      
     http_req_waiting...........: med=2.67ms  p(99)=11.74ms 
     http_reqs..................: 30029   3002.177251/s
     iteration_duration.........: med=2.83ms  p(99)=11.98ms 
     iterations.................: 30029   3002.177251/s
     vus........................: 10      min=10             max=10
     vus_max....................: 10      min=10             max=10

     


## Submit Assignment API

http_reqs: 12497 
http_req_duration - median: 6.84ms
http_req_duration - 99th percentile: 13.21ms 

     execution: local
        script: performance-test-submit-assignment.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 40s max duration (incl. graceful stop):
              * default: 10 looping VUs for 10s (gracefulStop: 30s)


     data_received..............: 16 MB   1.6 MB/s
     data_sent..................: 2.3 MB  230 kB/s
     http_req_blocked...........: med=2.57µs  p(99)=7.33µs  
     http_req_connecting........: med=0s      p(99)=0s      
     http_req_duration..........: med=6.84ms  p(99)=13.21ms 
     http_req_failed............: 100.00% 12497 out of 12497
     http_req_receiving.........: med=62.98µs p(99)=131.29µs
     http_req_sending...........: med=10.62µs p(99)=45.59µs 
     http_req_tls_handshaking...: med=0s      p(99)=0s      
     http_req_waiting...........: med=6.76ms  p(99)=13.13ms 
     http_reqs..................: 12497   1248.579162/s
     iteration_duration.........: med=6.93ms  p(99)=13.31ms 
     iterations.................: 12497   1248.579162/s
     vus........................: 10      min=10             max=10
     vus_max....................: 10      min=10             max=10



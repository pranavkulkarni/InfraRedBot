# Milestone: Deployment

Docker Setup (Ubuntu 16.04)

	apt-get update
	apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
	apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
	apt-get update
	apt-cache policy docker-engine
	apt-get install -y docker-engine
	systemctl status docker
	
	
Install Docker-Compose:

	apt-get install python-pip
	pip install docker-compose
	
---

#### Deployment Instructions

*	Edit docker-compose.yml
	* add APIAITOKEN and ALTCODETOKEN without ""
*	Deployment

		docker-compose build
		docker-compose up
* Tear-down

		docker-compose down

---

#### Screencast
[https://www.youtube.com/watch?v=bj01AvrSfgI](https://www.youtube.com/watch?v=bj01AvrSfgI)

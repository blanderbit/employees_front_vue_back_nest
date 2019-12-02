####About Employee project

````
1) просматривать записи могут все 
2) редактировать, добавлять, удалять только зарегестрированые юзера

````

#### Employee project developer documentation


````
Ease запуск(с помощью bash): 
обязательно должен быть docker

bash ./start.sh

Запустится фронт на http://localhost:8080
Запустится back на http://localhost:3001
````

````
Запуск(с помощью docker): 

1) sudo service mysql stop -> нужно убедится что mysql отключен
2) sudo fuser -k 3306/tcp
3) sudo fuser -k 3301/tcp 
    -> нужно убедится что свободен 3001 порт для запуска бэкенда
4) sudo fuser -k 8080/tcp 
    -> нужно убедится что свободен 8080 порт для запуска фронтенда
5) sudo docker-compose up 
    -> запуск контейнера

````

````
Запуск(вручную): 

Node.js -> 10 version

Back:

1) cd back
2) back/ormconfig.json 
    -> вставить нужную конфигурацию для базы данных
3) sudo fuser -k 3301/tcp 
    -> нужно убедится что свободен 3001 порт для запуска бэкенда
4) npm i && npm run start:dev

front:

1) cd front
2) sudo fuser -k 8080/tcp 
    -> нужно убедится что свободен 8080 порт для запуска фронтенда
3) npm i && npm run serve

````
#### Back api
######open address
````
Auth

****

method: 'POST'
url: 'auth/signUp'
data: {
    name: [required, min(4)]
    password: [required, min(4)]
    email: [required, email]
}

****

method: 'POST'
url: 'auth/signIn'
data: {
    password: [required, min(4)]
    email: [required, email]
}

response: token
****
````
######closed address
````
User

****

method: 'GET'
url: 'auth/user'
headers:{
    Authorization: `Bearer ${token}`    
}

****
````
######open address
````
Employees

****

method: 'GET'
url: 'employees'
params:{
    page:number
    take: number
    find: base64 зашифровать искомые поля (fio, dateOfBirth, position, salary)
}

****
````
######closed address
````
Employees

****

method: 'POST'
url: 'employees'
headers:{
    Authorization: `Bearer ${token}`    
}
data:{
    fio: [required, string, min (6)]
    dateOfBirth:[required, string]
    position:[required, string]
    salary: [required, number]
}

****

method: 'GET'
url: 'employees/:id'
headers:{
    Authorization: `Bearer ${token}`    
}

****

method: 'DELETE'
url: 'employees/:id'
headers:{
    Authorization: `Bearer ${token}`    
}

****

method: 'PUT'
url: 'employees/:id'
headers:{
    Authorization: `Bearer ${token}`    
}
data:{
    fio: [required, string, min (6)]
    dateOfBirth:[required, string]
    position:[required, string]
    salary: [required, number]
}

****
````

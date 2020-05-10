--------
# url/event/list/колличеcтво_данных/страница
- **краткая форма мероприятий для главной страницы**
- **Страничный вывод, GET запрос**
Формат JSON ***сервер->React***
 список событий:
 
		 [
			{
				"eventshortlist": {
					"id": int,
					"name": string,
					"info": string,
					"image": string
				},
				"tags": [
					string,
				]
			},
		]


----------
# url/event/info 
- ***полная ифнормация об мероприятии***
- **POST запрос**
 Формат POST ***React->Сервер***
 Данные входа:
 
		{
			"idEvent" : int
		}


 Формат JSON ***сервер->React***
 Данные аккаунта:


		{
			"event": {
				"id": int,
				"name": string,
				"info": string,
				"link": string,
				"ticket_price": "220,00 ?",
				"id_organizer": 1,
				"id_address": 1,
				"image": string,
				"organization_name": string,
				"logo": string
			},
			"tags": [
				{
					"eventtags": {
						"title": string
					}
				},
			]
		}

---
# url/event/tags
- ***список всех тегов***
- **GET запрос**
 Формат JSON ***Сервер->React***
 Данные входа:
 
		[
			{
				"tags": {
					"id":int,
					"title": string
				}
			},
		]

---
# url/event/tags/колличеcтво_данных/страница
- ***список всех тегов странично***
- **GET запрос**
 Формат JSON ***Сервер->React***
 Данные входа:
 
			{
				"count": int,
				"tags": [
					{
						"tags": {
							"id": int,
							"title": string
						}
					},
					]
			}
		
---
# url/search/колличеcтво_данных/страница
- ***поиск по мероприятиям (по названию и информации о нем)***
- **POST запрос**
 Формат POST ***React->Сервер***
 Данные входа:
 
		{
			"word" : string
		}

 Формат JSON ***сервер->React***
 Данные аккаунта:

		[
			{
				"searchevent": {
					"id": int,
					"name":string,
					"info": string,
					"image": string
				},
				"tags": [
					string,
				]
			},
		]

---

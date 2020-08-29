#!/bin/bash

#set -x

menuFile="./src/components/Menu/Menu.tsx"
replace=(
	"s/primary=\"Конференции\"/primary=\"План обучения\"/"
	"s/primary=\"Участники\"/primary=\"Школы\"/"
	"s/primary=\"Персонал\"/primary=\"Ученики\"/"
	)
for index in ${!replace[*]}
do
	sed -i "${replace[$index]}" $menuFile
done

staffFile="./src/components/Staff/Staff.tsx"
replace=(
  "s/>Сотрудники />Ученики /"
  "s/>Новый сотрудник<\/Button>/>Новый ученик<\/Button>/"
	)
for index in ${!replace[*]}
do
	sed -i "${replace[$index]}" $staffFile
done

#set -x
conferencesFile="./src/components/Сonferences/Сonferences.tsx"
replace=(
  "s/>Конференции</>План обучения</"
	)
for index in ${!replace[*]}
do
	sed -i "${replace[$index]}" $conferencesFile
done

personalFile="./src/components/Personal/Personal.tsx"
replace=(
  "s/>Персонал</>Ученики</"
	)
for index in ${!replace[*]}
do
	sed -i "${replace[$index]}" $personalFile
done

participantsFile="./src/components/Participants/Participants.tsx"
replace=(
  "s/>Участники</>Министерство Образования Республики Казахстан</"
	)
for index in ${!replace[*]}
do
	sed -i "${replace[$index]}" $participantsFile
done

addStaffFile="./src/components/AddStaff/AddStaff.tsx"
replace=(
  "s/>Добавление нового сотрудника</>Добавление нового ученика</"
	)
for index in ${!replace[*]}
do
	sed -i "${replace[$index]}" $addStaffFile
done

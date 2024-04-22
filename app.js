window.addEventListener("load", solve);

function solve() {
    let loadCoursesElement = document.getElementById('load-course');
    loadCoursesElement.addEventListener('click', e=>loadCourses());

    let courseListElement = document.getElementById('list');

    let addCourseButton = document.getElementById('add-course');
    addCourseButton.addEventListener('click', e=>addCourse(e));
    let titleField = document.getElementById('course-name');
    let typeField = document.getElementById('course-type');
    let descriptionField = document.getElementById('description');
    let teacherNameField = document.getElementById('teacher-name');
    let allInputFields = [];
    allInputFields.push(titleField);
    allInputFields.push(typeField);
    allInputFields.push(descriptionField);
    allInputFields.push(teacherNameField);

    let currentCourseId = '';
    let editCourseButton = document.getElementById('edit-course');
    editCourseButton.addEventListener('click', e=>editCourseInDb(e));

    async function loadCourses(){
        courseListElement.innerHTML= '';
        const allCourses = await (await fetch('http://localhost:3030/jsonstore/tasks/')).json();
        for (let course of Object.values(allCourses)){
            let courseTitle = course.title;
            let courseDescription = course.description;
            let courseId = course._id;
            let courseTeacher = course.teacher;
            let courseType = course.type;

            let containerElement = document.createElement('div');
            containerElement.classList.add('container');
            containerElement.setAttribute('id', courseId);

            let headingElement = document.createElement('h2');
            headingElement.textContent = courseTitle;
            containerElement.appendChild(headingElement);

            let teacherElement = document.createElement('h3');
            teacherElement.textContent = courseTeacher;
            containerElement.appendChild(teacherElement);

            let typeElement = document.createElement('h3');
            typeElement.textContent = courseType;
            containerElement.appendChild(typeElement);

            let descritionElement = document.createElement('h4');
            descritionElement.textContent = courseDescription;
            containerElement.appendChild(descritionElement);

            let editButtonElement = document.createElement('button');
            editButtonElement.classList.add('edit-btn');
            editButtonElement.textContent= 'Edit Course';
            containerElement.appendChild(editButtonElement);
            editButtonElement.addEventListener('click', e=> editCourse(e));

            let finishButtonElement = document.createElement('button');
            finishButtonElement.classList.add('finish-btn');
            finishButtonElement.textContent = 'Finish Course';
            containerElement.appendChild(finishButtonElement);
            finishButtonElement.addEventListener('click', e=>finishCourse(e));

            courseListElement.appendChild(containerElement);
        }
    }

    async function addCourse(e){
        e.preventDefault();
        if (allInputFields.find(f=>!f.value)){
            return;
        }

        let newCourse = getCourseInfo();

        await fetch('http://localhost:3030/jsonstore/tasks/', {
            method: 'POST',
            body: JSON.stringify(newCourse)
        });

        allInputFields.forEach(f=>f.value=null);

        loadCourses();
    }

    function getCourseInfo(){
        return {
            title: titleField.value,
            type: typeField.value,
            description: descriptionField.value,
            teacher: teacherNameField.value
        };
    }

    function editCourse(e){
        currentCourseId = e.target.parentNode.getAttribute('id');
        titleField.value = e.target.parentNode.getElementsByTagName('h2')[0].textContent;
        typeField.value = e.target.parentNode.getElementsByTagName('h3')[1].textContent;
        descriptionField.value = e.target.parentNode.getElementsByTagName('h4')[0].textContent;
        teacherNameField.value = e.target.parentNode.getElementsByTagName('h3')[0].textContent;
        e.target.parentNode.remove();

        editCourseButton.disabled = false;
        addCourseButton.disabled = true;
    }

    async function editCourseInDb(e){
        e.preventDefault();
        let editedCourse = getCourseInfo();
        editedCourse._id = currentCourseId;
        console.log(editedCourse);

        await fetch(`http://localhost:3030/jsonstore/tasks/${currentCourseId}`, {
            method: 'PUT',
            body: JSON.stringify(editedCourse)
        });

        loadCourses();

        editCourseButton.disabled = true;
        addCourseButton.disabled = false;
        allInputFields.forEach(f=>f.value = null);
    }

    async function finishCourse(e){
        currentCourseId = e.target.parentNode.getAttribute('id');
        await fetch(`http://localhost:3030/jsonstore/tasks/${currentCourseId}`, {
            method: 'DELETE'
        });

        loadCourses();
    }
}
var libraryTable = document.querySelector('tbody');
let newBookButton = document.querySelector("button[name='add-new-book']");
let saveButton = document.querySelector("button[name='save-edit']");
var tableHead = document.querySelector("tr[class='table-head']")
//let newBookButton = document.getElementById("add-new-book")

newBookButton.addEventListener('click', addInputRow);

var myLibrary = {}; //Library is an object

if (storageAvailable('localStorage')) {
    // Yippee! We can use window.localStorage awesomeness
    let localData = window.localStorage.getItem('localLibrary');
    if (localData !== null) {
        if (localData.includes('libIndexNumber')){
            myLibrary = JSON.parse(localData);
    
            /*myLibrary.forEach((oneBook) => {
                let eachRow = addSavedRow(oneBook.libIndexNumber);
                libraryTable.insertBefore(eachRow,tableHead.nextElementSibling);
            })*/

            for (const eachBookIndex in myLibrary) {
                eachBook = myLibrary[eachBookIndex];
                let eachRow = addSavedRow(eachBook.libIndexNumber);
                libraryTable.insertBefore(eachRow,tableHead.nextElementSibling);
            }
        }
    }

}


function addInputRow(event) {
    if (document.querySelector('.input-row') !== null) {
        return;
    }
    var clickedElement = event.target;

    // identify the nature of the clicked button;
    var classOfCE = clickedElement.getAttribute('class');

    // Case 1. If user clicked the Add New Book Button
    if (classOfCE === 'add-new-book') {
        var thisInputRow = document.createElement('tr');
        
        //var indexNumber = myLibrary.length;
        var indexNumber;
        if (document.querySelector("tr[class='saved-row']")===null) {
            indexNumber = 0;

        } else {
            indexNumber = parseInt(libraryTable.children[1].getAttribute('data-index'))+1;
        }
        // create a temporary, empty Book Information as a place holder
        var newTempBook = new BookInfo('', '', '', 'read', indexNumber)
        libraryTable.insertBefore(thisInputRow,tableHead.nextElementSibling);

    }
    else {
        // Case 2. If user clicked the Edit Button (saved row) 
        var thisSavedRow = clickedElement.parentNode.parentNode;
        var indexNumber = thisSavedRow.getAttribute('data-index');
        var thisInputRow = document.createElement('tr');
        libraryTable.insertBefore(thisInputRow,thisSavedRow);
        libraryTable.removeChild(thisSavedRow);

        //var newTempBook = myLibrary[indexNumber];
        let bookIndex = 'book-' + indexNumber;
        var newTempBook = myLibrary[bookIndex];


    }

    thisInputRow.setAttribute('class', 'input-row');
    thisInputRow.setAttribute('data-index', indexNumber);

    var titleField = addInputField('text', 'title', newTempBook.title, indexNumber)
    var authorField = addInputField('text', 'author', newTempBook.author, indexNumber)
    var pageNumberField = addInputField('number', 'page-number', newTempBook.totalPageNumber, indexNumber)
    pageNumberField.firstChild.setAttribute('onkeypress', 'return event.charCode >= 48')
    pageNumberField.firstChild.setAttribute('min', '0')

    var readStatusButton = addReadButton(newTempBook.readStatus, indexNumber);

    var saveButton = addSaveButton(indexNumber);
    var deleteButton = addDeleteButton(indexNumber);

    thisInputRow.appendChild(titleField);
    thisInputRow.appendChild(authorField);
    thisInputRow.appendChild(pageNumberField);

    thisInputRow.appendChild(readStatusButton);
    thisInputRow.appendChild(saveButton);
    thisInputRow.appendChild(deleteButton);
}


function addInputField(fieldType, fieldName, fieldValue, fieldIndex) {
    let tableField = document.createElement('td');
    let inputElement = document.createElement('input');
    let fieldID = fieldName + '-' + fieldIndex;

    tableField.setAttribute('class', fieldName);
    tableField.setAttribute('data-index', fieldIndex);

    inputElement.setAttribute('type', fieldType);
    inputElement.setAttribute('name', fieldName);
    
    inputElement.setAttribute('id', fieldID);
    inputElement.setAttribute('value', fieldValue);
    tableField.appendChild(inputElement);
    return tableField;
}



function addReadButton(fieldValue, fieldIndex) {
    let tableField = document.createElement('td');
    let inputElement = document.createElement('button');
    let fieldID = 'read-' + fieldIndex;

    tableField.setAttribute('data-index', fieldIndex)
    tableField.setAttribute('class','read-status')
    inputElement.setAttribute('name', 'read-status')
    inputElement.setAttribute('id', fieldID)
    inputElement.setAttribute('class', 'read-button')
    inputElement.setAttribute('value', fieldValue)

    inputElement.innerText = fieldValue;
    inputElement.addEventListener('click', changeReadStatus);

    tableField.appendChild(inputElement);
    return tableField;
}

function addEditButton(fieldIndex) {
    let tableField = document.createElement('td');
    let inputElement = document.createElement('button');
    let fieldID = 'edit-' + fieldIndex;

    tableField.setAttribute('data-index', fieldIndex);
    tableField.setAttribute('class', 'save-edit');
    inputElement.innerText = 'edit';
    inputElement.setAttribute('name', 'edit');
    inputElement.setAttribute('class', 'edit-button');
    inputElement.setAttribute('id', fieldID);

    inputElement.addEventListener('click', addInputRow);

    tableField.appendChild(inputElement);
    return tableField;
}

function addSaveButton(fieldIndex) {
    let tableField = document.createElement('td');
    let inputElement = document.createElement('button');
    let fieldID = 'save-' + fieldIndex;

    tableField.setAttribute('data-index', fieldIndex);
    tableField.setAttribute('class', 'save-edit');
    inputElement.innerText = 'save';
    inputElement.setAttribute('name', 'save');
    inputElement.setAttribute('class', 'save-button');
    inputElement.setAttribute('id', fieldID);

    inputElement.addEventListener('click', () => {
        saveInput(fieldIndex);
    }
    );

    tableField.appendChild(inputElement);

    return tableField;
}

function addDeleteButton(fieldIndex) {
    let tableField = document.createElement('td');
    let inputElement = document.createElement('button');
    let fieldID = 'delete-' + fieldIndex;

    tableField.setAttribute('data-index', fieldIndex);
    tableField.setAttribute('class', 'delete');

    inputElement.innerText = 'delete';
    inputElement.setAttribute('name', 'delete');
    inputElement.setAttribute('class', 'delete-button');
    inputElement.setAttribute('id', fieldID);

    inputElement.addEventListener('click', () => {
        deleteRow(fieldIndex)
    }
    );

    tableField.appendChild(inputElement);

    return tableField;
}

function addSavedField(fieldName, fieldText, fieldIndex) {
    let tableField = document.createElement('td');
    let inputElement = document.createElement('span');
    let fieldID = fieldName + '-' + fieldIndex;

    tableField.setAttribute('data-index', fieldIndex)
    tableField.setAttribute('class', fieldName)
    inputElement.innerText = fieldText;
    inputElement.setAttribute('type', 'text')
    inputElement.setAttribute('class', fieldName)
    inputElement.setAttribute('name', fieldName)
    inputElement.setAttribute('id', fieldID)
    inputElement.setAttribute('value', fieldText)
    tableField.appendChild(inputElement);
    return tableField;
}


function changeReadStatus(event) {
    var clickedElement = event.target;
    let thisRow = clickedElement.parentNode.parentNode;
    // is it input row?

    let thisRowClass = thisRow.getAttribute('class');
    if (thisRowClass === "input-row") {
        var readButtonValue = clickedElement.getAttribute('value');
        if (readButtonValue === 'read') {
            clickedElement.innerText = 'not read';
            clickedElement.setAttribute('value', 'not read');
        }
        else {
            clickedElement.innerText = 'read';
            clickedElement.setAttribute('value', 'read');
        }
    }
    else //if this row is a Saved Row
    {
        var indexNumber = thisRow.getAttribute('data-index');
        var bookIndex = 'book-' + indexNumber;
        if (myLibrary[bookIndex].readStatus === 'read') {
            myLibrary[bookIndex].readStatus = 'not read';
            window.localStorage.setItem('localLibrary', JSON.stringify(myLibrary));

            clickedElement.innerText = 'not read';
            clickedElement.setAttribute('value', 'not read');
        }
        else if (myLibrary[bookIndex].readStatus === 'not read') {
            myLibrary[bookIndex].readStatus = 'read';
            window.localStorage.setItem('localLibrary', JSON.stringify(myLibrary));

            clickedElement.innerText = 'read';
            clickedElement.setAttribute('value', 'read');
        }
        else {

        }
    }


}

function deleteRow(indexNumber) {

    //Delete the saved row
    let rowToDelete = document.querySelector(`tr[data-index='${indexNumber}']`);
    var bookIndex = 'book-' + indexNumber;
    libraryTable.removeChild(rowToDelete);
    //if (rowToDelete.getAttribute('class') === 'saved-row') {
    if (myLibrary[bookIndex]) {
    
        delete myLibrary[bookIndex];
        //myLibrary[indexNumber] = [];
        //myLibrary.splice(indexNumber,1);
        window.localStorage.setItem('localLibrary', JSON.stringify(myLibrary));
    }

}

function saveInput(indexNumber) {

    let bookTitle = document.getElementById(`title-${indexNumber}`).value;
    let bookAuthor = document.getElementById(`author-${indexNumber}`).value;
    let bookPageNumber = document.getElementById(`page-number-${indexNumber}`).value;
    let bookReadStatus = document.getElementById(`read-${indexNumber}`).value;
    var bookIndex = 'book-' + indexNumber;
    if (bookTitle === '') {
        return alert('You cannot leave BookTitle Empty');
    }

    if (myLibrary[bookIndex]) {
        myLibrary[bookIndex].title = bookTitle;
        myLibrary[bookIndex].author = bookAuthor;
        myLibrary[bookIndex].totalPageNumber = bookPageNumber;
        myLibrary[bookIndex].readStatus = bookReadStatus;
    } else {
        let newBook = new BookInfo(bookTitle, bookAuthor, bookPageNumber, bookReadStatus, indexNumber);
        myLibrary[bookIndex] = newBook;
    }
    window.localStorage.setItem('localLibrary', JSON.stringify(myLibrary));

    let oldRow = document.querySelector(`tr[data-index='${indexNumber}']`)
    let newRow = addSavedRow(indexNumber);
    libraryTable.insertBefore(newRow,oldRow.nextElementSibling);
    libraryTable.removeChild(oldRow);
    //deleteRow(indexNumber);
}

function addSavedRow(indexNumber) {
    let bookIndex = 'book-' + indexNumber;
    let thisSavedRow = document.createElement('tr');
    thisSavedRow.setAttribute('data-index', indexNumber);
    thisSavedRow.classList.add('saved-row');
    let thisBook = myLibrary[bookIndex];

    var titleField = addSavedField('title', thisBook.title, indexNumber);
    var authorField = addSavedField('author', thisBook.author, indexNumber);
    var pageNumberField = addSavedField('page-number', thisBook.totalPageNumber, indexNumber);

    var readStatusButton = addReadButton(thisBook.readStatus, indexNumber)
    var editButton = addEditButton(indexNumber);
    var deleteButton = addDeleteButton(indexNumber);

    thisSavedRow.appendChild(titleField);
    thisSavedRow.appendChild(authorField);
    thisSavedRow.appendChild(pageNumberField);

    thisSavedRow.appendChild(readStatusButton);
    thisSavedRow.appendChild(editButton);
    thisSavedRow.appendChild(deleteButton);

    return thisSavedRow;
}

function BookInfo(title, author, totalPageNumber, readStatus, libIndexNumber) {
    this.libIndexNumber = libIndexNumber;
    this.title = title;
    this.author = author;
    this.totalPageNumber = totalPageNumber.toString();
    this.readStatus = readStatus;
}



// Check on if the web browser supports the local storage.
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}


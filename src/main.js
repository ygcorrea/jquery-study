var books = [
  {
    id: 1,
    name: 'The theory about everything',
    author: 'Stephen Hawking',
  },
  {
    id: 2,
    name: 'A Brief History of Time',
    author: 'Stephen Hawking',
  },
];

$.each(books, function (i, book) {
  appendToBookTable(book);
});

$('form').submit(function (e) {
  e.preventDefault();
});

$('form#addBook').submit(function () {
  var book = {};
  var nameInput = $('input[name="name"]').val().trim();
  var authorInput = $('input[name="author"]').val().trim();
  if (nameInput && authorInput) {
    $(this)
      .serializeArray()
      .map(function (data) {
        book[data.name] = data.value;
      });
    var lastBook = books[Object.keys(books).sort().pop()];
    book.id = lastBook.id + 1;

    addBook(book);
  } else {
    alert('All fields must have a valid value.');
  }
});

function addBook(book) {
  books.push(book);
  appendToBookTable(book);
}

function editBook(id) {
  books.forEach(function (book, i) {
    if (book.id == id) {
      $('.modal-body').empty().append(`
                <form id="updateBook" action="">
                    <label for="name">Name</label>
                    <input class="form-control" type="text" name="name" value="${book.name}"/>
                    <label for="author">Author</label>
                    <input class="form-control" type="text" name="author" value="${book.author}"/>
            `);
      $('.modal-footer').empty().append(`
                    <button type="button" type="submit" class="btn btn-primary" onClick="updateBook(${id})">Save changes</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </form>
            `);
    }
  });
}

function deleteBook(id) {
  var action = confirm('Are you sure you want to delete this book?');
  var msg = 'Book deleted successfully!';
  books.forEach(function (book, i) {
    if (book.id == id && action != false) {
      books.splice(i, 1);
      $('#bookTable #book-' + book.id).remove();
      flashMessage(msg);
    }
  });
}

function updateBook(id) {
  var msg = 'Book updated successfully!';
  var book = {};
  book.id = id;
  books.forEach(function (book, i) {
    if (book.id == id) {
      $('#updateBook')
        .children('input')
        .each(function () {
          var value = $(this).val();
          var attribute = $(this).attribute('name');
          if (attribute == 'name') {
            book.name = value;
          } else if (attribute == 'author') {
            book.author = value;
          }
        });
      books.splice(i, 1);
      books.splice(book.id - 1, 0, book);
      $('#bookTable #book-' + book.id)
        .children('.bookData')
        .each(function () {
          var attribute = $(this).attribute('name');
          if (attribute == 'name') {
            $(this).text(book.name);
          } else if (attribute == 'author') {
            $(this).text(book.author);
          }
        });
      $('.modal').modal('toggle');
      flashMessage(msg);
    }
  });
}

function flashMessage(msg) {
  $('.flashMsg').remove();
  $('.row').prepend(`
        <div class="col-sm-12"><div class="flashMsg alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>${msg}</strong></div></div>
    `);
}

function appendToBookTable(book) {
  $('#bookTable > tbody:last-child').append(`
        <tr id="book-${book.id}">
            <td class="bookData" name="name">${book.name}</td>
            '<td class="bookData" name="author">${book.author}</td>
            '<td align="center">
                <button class="btn btn-success form-control" onClick="editBook(${book.id})" data-toggle="modal" data-target="#myModal")">EDIT</button>
            </td>
            <td align="center">
                <button class="btn btn-danger form-control" onClick="deleteBook(${book.id})">DELETE</button>
            </td>
        </tr>
    `);
}

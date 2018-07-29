import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Book from './Books'
import {PropTypes} from 'prop-types'
import * as BooksAPI from './BooksAPI'

class BookSearch extends Component {
 //set empty state
  state = {
    Books: [],
    query: ''
  }

  //define props
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    myBooks: PropTypes.array.isRequired
  }

  //handle state
  handleChange = (event) => {
    var value = event.target.value
    this.setState(() => {
      return {query: value}
    })
    this.searchBooks(value)
  }

//change book shelf
  bookShelfChange = (books) => {
    let all_Books = this.props.myBooks
    for (let book of books) {
      book.shelf = "none"
    }

    for (let book of books) {
      for (let b of all_Books) {
        if (b.id === book.id) {
          book.shelf = b.shelf
        }
      }
    }
    return books
  }
//search books and return results if available with images. 
//If no book cover is available  do not return the book.
//Change self
  searchBooks = (val) => {
    if (val.length !== 0) {
      BooksAPI.search(val, 10).then((books) => {
        if (books.length > 0) {
          books = books.filter((book) => (book.imageLinks))
          books = this.bookShelfChange(books)
        }
        this.setState(() => {
          return {Books: books}
        })
      })
    } else {
      this.setState({Books: [], query: ''})
    }
  }

  add_book = (book, shelf) => {
    this.props.onChange(book, shelf)
  }

  render() {
   
   //Conditional Rendering for 
   //(a) results found and
   //(b) results not found
   let result;
    if (this.state.Books.length > 0) {
      result = this.state.Books.map((book, index) => (<Book book={book} key={index} onUpdate={(shelf) => {
        this.add_book(book, shelf)
      }}/>))
    } else {
      result = 'No results found';
    }

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to='/' className="close-search">Close</Link>
          <div className="search-books-input-wrapper">
            <input type="text" placeholder="Search by title or author" value={this.state.query} onChange={this.handleChange}/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.query.length ? result : ''}
          </ol>
        </div>
      </div>
    )
  }
}

export default BookSearch;

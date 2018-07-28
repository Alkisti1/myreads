import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Book from './Books'
import {PropTypes} from 'prop-types'
import * as BooksAPI from './BooksAPI'

class BookSearch extends Component {
  state = {
    Books: [],
    query: ''
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    myBooks: PropTypes.array.isRequired
  }

  handleChange = (event) => {
    var value = event.target.value
    this.setState(() => {
      return {query: value}
    })
    this.search_books(value)
  }

  changeBookShelf = (books) => {
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

  search_books = (val) => {
    if (val.length !== 0) {
      BooksAPI.search(val, 10).then((books) => {
        if (books.length > 0) {
          books = books.filter((book) => (book.imageLinks))
          books = this.changeBookShelf(books)
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

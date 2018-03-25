var express = require('express')
var app = express()

// SHOW LIST OF POKEMON
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM pokemon',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('pokemon/list', {
					title: 'Pokemon List',
					data: ''
				})
			} else {
				// render to views/pokemon/list.ejs template file
				res.render('pokemon/list', {
					title: 'Pokemon List',
					data: rows
				})
			}
		})
	})
})

module.exports = app

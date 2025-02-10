import express from 'express';

const app = express()

import pg from 'pg'
const { Client } = pg



app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/employee/:id', async (req, res) => {
    let client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    let resultQuery = await client.query('select *,to_char(date_of_birth, \'yyyy-mm-dd\') as date_of_birth_str from employee where id = $1', [+req.params.id])
    let employee = resultQuery.rows[0]
    await client.end()
    client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    resultQuery = await client.query(`select employee_role.*, role.name from employee_role 
left join role on role.id = employee_role.role_id
where employee_id = $1`, [+req.params.id])
    let employee_role = resultQuery.rows
    await client.end()

    res.render('employee', {
        employee: employee,
        isNew: false,
        employee_role: employee_role
    })
})

app.post('/add_user', (req, res) => {
    let username = req.body.username
    if (username == '')
        return res.redirect('/')
    else
        return res.redirect('/user/' + username)
})

app.listen(4000, () => {
    console.log('Server started')
})

app.get('/employee', async (req, res) => {
    const client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    const resultQuery = await client.query(`select e.id, e.first_name, e.last_name, e.email, e.gender, e.date_of_birth, e.country_of_birth, e.bicycle_id,
string_agg(r.name, ' ') as roles
from employee e 
left join employee_role er on e.id = er.employee_id
left join role r on er.role_id = r.id
group by e.id,e.first_name, e.last_name, e.email, e.gender, e.date_of_birth, e.country_of_birth, e.bicycle_id
order by id`, [])
    let employees = resultQuery.rows
    await client.end()
    employees.forEach((employee) => {
        if (employee.date_of_birth != null) {
            employee.date_of_birth_str = employee.date_of_birth.toLocaleDateString("ru-RU")
        }
        else {
            employee.date_of_birth_str = 'хрен его знает'
        }
    })
    res.render('employees', {
        employees: employees,
    })
})
app.post('/employee/:id', async (req, res) => {
    console.log(req.body)
    const client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    await client.query('update employee set first_name = $2, last_name = $3, email = $4, gender = $5, country_of_birth = $6, date_of_birth = $7 where id = $1', [+req.params.id, req.body.first_name, req.body.last_name, req.body.email, req.body.gender, req.body.country_of_birth, new Date(Date.parse(req.body.date_of_birth_str))])
    await client.end()
    return res.redirect('/employee')
})
app.delete('/employee/remove/:id', async (req, res) => {
    const client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    await client.query('delete from employee where id = $1', [+req.params.id])
    await client.end()
    return res.json({})
})
app.post('/employee', async (req, res) => {
    const client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    await client.query('insert into employee (first_name, last_name, email, gender, country_of_birth, date_of_birth) values ($1, $2, $3, $4, $5, $6)',
        [req.body.first_name, req.body.last_name, req.body.email, req.body.gender, req.body.country_of_birth, new Date(Date.parse(req.body.date_of_birth_str))])
    await client.end()
    return res.redirect('/employee')
})
app.get('/employee_add', async (req, res) => {
    res.render('employee', {
        employee: {},
        isNew: true
    })
})
/**
 *добавить спавочник(таблицу) ролей(role)
 У неe будет id, name, comment, code
            BIGINT,   VAR_CHAR
 */
app.get('/role', async (req, res) => {
    const client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    const resultQuery = await client.query('select * from role order by id', [])
    let roles = resultQuery.rows
    await client.end()
    res.render('roles', {
        roles: roles
    })
})
app.get('/role/:id', async (req, res) => {
    const client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    const resultQuery = await client.query('select * from role where id = $1', [+req.params.id])
    let role = resultQuery.rows[0]
    await client.end()
    res.render('role', {
        role: role,
        isNew: false
    })
})
app.post('/role/:id', async (req, res) => {
    console.log(req.body)
    const client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    await client.query('update role set name = $2, comment = $3, code = $4 where id = $1', [+req.params.id, req.body.name, req.body.comment, req.body.code])
    await client.end()
    return res.redirect('/role')
})
app.delete('/role/remove/:id', async (req, res) => {
    const client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    await client.query('delete from role where id = $1', [+req.params.id])
    await client.end()
    return res.json({})
})
app.post('/role', async (req, res) => {
    const client = new Client({
        user: 'postgres',
        password: 'neparol',
        host: 'localhost',
        port: 5432,
        database: 'test',
    })
    await client.connect()
    await client.query('insert into role (name, comment, code) values ($1, $2, $3)',
        [req.body.name, req.body.comment, req.body.code])
    await client.end()
    return res.redirect('/role')
})
app.get('/role_add', async (req, res) => {
    res.render('role', {
        role: {},
        isNew: true

    })
})
import express from 'express';
import { query } from './library.js';
const app = express()

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
    let employee = (await query('select *,to_char(date_of_birth, \'yyyy-mm-dd\') as date_of_birth_str from employee where id = $1', [+req.params.id]))[0]
    let employee_role = await query(`select employee_role.*, role.name from employee_role 
left join role on role.id = employee_role.role_id
where employee_id = $1`, [+req.params.id])
    let regions = await query('select * from region', [])
    // let query = `select * from employee where id = ${req.params.id}` как делать не нужно(sql инъекция)
    res.render('employee', {
        employee: employee,
        isNew: false,
        employee_role: employee_role,
        regions: regions
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
    let employees = await query(`select e.id, e.first_name, e.last_name, e.email, e.gender, e.date_of_birth, e.bicycle_id, 
string_agg(r.name, ' ') as roles, reg.name_of_country
from employee e 
left join employee_role er on e.id = er.employee_id
left join role r on er.role_id = r.id
left join region reg on reg.id = e.region_id
group by e.id,e.first_name, e.last_name, e.email, e.gender, e.date_of_birth, reg.name_of_country, e.bicycle_id
order by id
`, [])
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
    await query('update employee set first_name = $2, last_name = $3, email = $4, gender = $5, region_id = $6, date_of_birth = $7 where id = $1', [+req.params.id, req.body.first_name, req.body.last_name, req.body.email, req.body.gender, req.body.name_of_country, new Date(Date.parse(req.body.date_of_birth_str))])
    return res.redirect('/employee')
})
app.delete('/employee/remove/:id', async (req, res) => {
    await query('delete from employee where id = $1', [+req.params.id])
    return res.json({})
})
app.post('/employee', async (req, res) => {
    await query('insert into employee (first_name, last_name, email, gender, region_id, date_of_birth) values ($1, $2, $3, $4, $5, $6)',
        [req.body.first_name, req.body.last_name, req.body.email, req.body.gender, req.body.name_of_country, new Date(Date.parse(req.body.date_of_birth_str))])
    return res.redirect('/employee')
})
app.get('/employee_add', async (req, res) => {
    let regions = await query('select * from region', [])
    res.render('employee', {
        employee: {},
        isNew: true,
        employee_role: [],
        regions: regions
    })
})
/**
 *добавить спавочник(таблицу) ролей(role)
 У неe будет id, name, comment, code
            BIGINT,   VAR_CHAR
 */
app.get('/role', async (req, res) => {
    let roles = await query('select * from role order by id', [])
    res.render('roles', {
        roles: roles
    })
})
app.get('/role/:id', async (req, res) => {
    let role = (await query('select * from role where id = $1', [+req.params.id]))[0]
    res.render('role', {
        role: role,
        isNew: false
    })
})
app.post('/role/:id', async (req, res) => {
    await query('update role set name = $2, comment = $3, code = $4 where id = $1', [+req.params.id, req.body.name, req.body.comment, req.body.code])
    return res.redirect('/role')
})
app.delete('/role/remove/:id', async (req, res) => {
    await query('delete from role where id = $1', [+req.params.id])
    return res.json({})
})
app.post('/role', async (req, res) => {
    await query('insert into role (name, comment, code) values ($1, $2, $3)',
        [req.body.name, req.body.comment, req.body.code])
    return res.redirect('/role')
})
app.get('/role_add', async (req, res) => {
    res.render('role', {
        role: {},
        isNew: true

    })
})
app.get('/region', async (req, res) =>{
    let regions = await query('select * from region order by id')
    res.render('regions', {
        regions: regions
    })
})
app.get('/region/:id', async(req, res) => {
    let region = (await query('select * from region where id = $1', [+req.params.id]))[0]
    res.render('region', {
        region: region,
        isNew: false
    })
})
app.post('/region/:id', async(req, res) => {
    await query('update region set name_of_country = $2, code = $3 where id = $1', [+req.params.id, req.body.name_of_country, req.body.code])
    return res.redirect('/region')
})
app.delete('/region/remove/:id', async(req, res) => {
    await query('delete from region where id = $1', [+req.params.id])
    return res.json({})
})
app.post('/region', async(req, res) => {
    await query('insert into region(name_of_country, code) values($1, $2)', [req.body.name_of_country, req.body.code])
    return res.redirect('/region')
})
app.get('/region_add', async (req, res) => {
    res.render('region', {
        region: {},
        isNew: true
    })
})
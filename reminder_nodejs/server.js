const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'reminders.json');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reminder.html'));
});

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));

app.post('/reminder.html/register', (req, res) => {
    const { email, password, login } = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        const users = JSON.parse(data || '[]');
        const existingUser  = users.find(user => user.email === email);
        const existingLogin = users.find(user => user.login === login);

        if (existingUser ) {
            return res.status(400).send('User already exists');
        }

        if (existingLogin) {
            return res.status(400).send('Login exists');
        }

        const newUser  = {
            user_id: Date.now().toString(),
            login,
            email,
            password,
            telegram_id: null,
            is_banned: false,
            is_admin: false,
            reminders: []
        };

        users.push(newUser);
        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), err => {
            if (err) return res.status(500).send('Error writing data file');
            res.status(201).send('User registered successfully');
        });
    });
});

app.post('/reminder.html/login', (req, res) => {
    const { login, password } = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        const users = JSON.parse(data || '[]');
        const user = users.find(u => u.email === login || u.login === login);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.password !== password) {
            return res.status(401).send('Invalid password');
        }

        if (user.is_banned) {
            return res.status(403).send('User is banned');
        }

        req.session.user = {
            user_id: user.user_id,
            login: user.login,
            email: user.email,
            is_admin: user.is_admin,
        };

        if (user.is_admin) {
            return res.status(201).json({message: 'Login as admin', user_id: user.user_id});
        }

        res.status(200).json({ message: 'Login successful', user_id: user.user_id });
    });
});

app.post('/admin.html/login', (req, res) => {
    const { login, password } = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        const users = JSON.parse(data || '[]');
        const user = users.find(u => u.email === login || u.login === login);
        if (!user) {
            return res.status(404).send('User not found');
        }

        req.session.user = {
            user_id: user.user_id,
            login: user.login,
            email: user.email,
            is_admin: user.is_admin,
        };

        res.status(200).json({ message: 'Login successful', user_id: user.user_id });
    });
});

app.get('/reminders', (req, res) => {
    const userId = req.query.id || (req.session.user && req.session.user.user_id);
    if (!userId) {
        return res.status(403).send('Unauthorized');
    }

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        const users = JSON.parse(data || '[]');
        const user = users.find(u => u.user_id === userId);
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json({
            email: user.email,
            telegram_id: user.telegram_id,
            reminders: user.reminders
        });
    });
});



app.post('/reminders', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('Unauthorized');
    }

    const { title, text, datetime, type } = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        const users = JSON.parse(data || '[]');
        const user = users.find(u => u.user_id === req.session.user.user_id);
        
        if (!user) {
            return res.status(404).send('User  not found');
        }

        const newReminder = {
            id: Date.now().toString(),
            title,
            text,
            datetime,
            type,
            is_active: true,
            is_deleted: false
        };

        user.reminders.push(newReminder);

        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), err => {
            if (err) return res.status(500).send('Error writing data file');
            res.status(201).json({
                reminder: newReminder,
                email: user.email,
                telegram_id: user.telegram_id
            });
        });
    });
});

app.put('/reminders/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('Unauthorized');
    }

    const reminderId = req.params.id;
    const { title, text, datetime, type } = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        const users = JSON.parse(data || '[]');
        const user = users.find(u => u.user_id === req.session.user.user_id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const reminder = user.reminders.find(r => r.id === reminderId);
        
        if (!reminder) {
            return res.status(404).send('Reminder not found');
        }

        // Обновляем данные напоминания
        reminder.title = title;
        reminder.text = text;
        reminder.datetime = datetime;
        reminder.type = type;

        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), err => {
            if (err) return res.status(500).send('Error writing data file');
            res.status(200).json({reminder, email: user.email, telegram_id: user.telegram_id});
        });
    });
});

app.post('/complete-reminder', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('Unauthorized');
    }

    const { reminderId } = req.body;
    const userId = req.session.user.user_id;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        const users = JSON.parse(data || '[]');
        const user = users.find(u => u.user_id === userId);
        
        if (!user) {
            return res.status(404).send('User  not found');
        }

        const reminder = user.reminders.find(r => r.id === reminderId);
        
        if (!reminder) {
            return res.status(404).send('Reminder not found');
        }

        reminder.is_active = false;

        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), err => {
            if (err) return res.status(500).send('Error writing data file');
            res.status(200).json({ message: 'Reminder completed', reminder });
        });
    });
});

app.put('/repeat-reminder', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('Unauthorized');
    }

    const { id, datetime } = req.body;
    const userId = req.session.user.user_id;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        let users = JSON.parse(data || '[]');
        const user = users.find(u => u.user_id === userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const reminder = user.reminders.find(r => r.id === id);
        if (!reminder) {
            return res.status(404).send('Reminder not found');
        }

        
        reminder.datetime = datetime;
        reminder.is_active = true;


        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing data file');
            res.status(200).json({ message: 'Reminder updated', reminder, email: user.email, telegram_id: user.telegram_id });
        });
    });
});

app.patch('/delete-reminder', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('Unauthorized');
    }

    const { id } = req.body;
    const userId = req.session.user.user_id;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        let users = JSON.parse(data || '[]');
        const user = users.find(u => u.user_id === userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const reminder = user.reminders.find(r => r.id === id);
        if (!reminder) {
            return res.status(404).send('Reminder not found');
        }

        reminder.is_deleted = true;

        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing data file');
            res.status(200).json({ message: 'Reminder deleted', reminder, is_active: user.is_active });
        });
    });
});

app.patch('/restore-reminder', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('Unauthorized');
    }

    const { id } = req.body;
    const userId = req.session.user.user_id;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading data file');

        let users = JSON.parse(data || '[]');
        const user = users.find(u => u.user_id === userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const reminder = user.reminders.find(r => r.id === id);
        if (!reminder || !reminder.is_deleted) {
            return res.status(404).send('Reminder not found or not deleted');
        }

        reminder.is_deleted = false;

        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing data file');
            res.status(200).json({ message: 'Reminder restored', reminder, is_active: user.is_active});
        });
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

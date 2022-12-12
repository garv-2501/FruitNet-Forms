// Route handler for forum web app

module.exports = function (app, forumData) {
    // Handle our routes

    // Home page
    app.get("/", function (req, res) {
        res.render("index.ejs", forumData);
    });

    // About page
    app.get("/about", function (req, res) {
        res.render("about.ejs", forumData);
    });

    // View Posts page
    app.get("/viewposts", function (req, res) {
        // Query to select all posts from the database
        let sqlquery = `SELECT   post_id, p.post_date, t.topic_title, p.post_title, p.post_content, u.username
                        FROM     posts p
                        JOIN     topics t
                        ON       t.topic_id=p.topic_id
                        JOIN     users u
                        ON       u.user_id = p.user_id
                        ORDER BY post_date DESC`;

        // Run the query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("./");
            }

            // Pass results to the EJS page and view it
            let data = Object.assign({}, forumData, { posts: result });
            console.log(data);
            res.render("viewposts.ejs", data);
        });
    });

    // List Users page
    app.get("/users", function (req, res) {
        // Query to select all users
        let sqlquery = `SELECT   username, firstname, surname, country
                        FROM     users 
                        ORDER BY username;`;

        // Run the query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("./");
            }

            // Pass results to the EJS page and view it
            let data = Object.assign({}, forumData, { users: result });
            console.log(data);
            res.render("users.ejs", data);
        });
    });
    app.post("/user-info", function (req, res) {
        //searching in the database
        let term = "%" + req.body.keyword + "%";
        let sqlquery = `SELECT u.user_id, u.firstname, u.surname, u.username, u.country, t.topic_title
                        FROM   membership m
                        JOIN topics t
                        ON t.topic_id = m.topic_id
                        JOIN users u
                        ON u.user_id = m.user_id
                        WHERE  username LIKE ?`;

        db.query(sqlquery, [term, term], (err, result) => {
            if (err) {
                res.redirect("./");
            }

            let allData = Object.assign([], forumData, { membership: result });
            res.render("user-info", allData);
        });
    });

    // List Topics page
    app.get("/topics", function (req, res) {
        // Query to select all topics
        let sqlquery = `SELECT   topic_id, topic_title, topic_description
                        FROM     topics
                        ORDER BY topic_title`;

        // Run the query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("./");
            }

            // Pass results to the EJS page and view it
            let data = Object.assign({}, forumData, { topics: result });
            console.log(data);
            res.render("topics.ejs", data);
        });
    });
    app.post("/topic-info", function (req, res) {
        //searching in the database
        let term = "%" + req.body.keyword + "%";
        let sqlquery = `SELECT u.user_id, u.username, u.firstname, u.surname, u.country
                        FROM   membership m
                        JOIN topics t
                        ON t.topic_id = m.topic_id
                        JOIN users u
                        ON u.user_id = m.user_id
                        WHERE  topic_title LIKE ?`;

        db.query(sqlquery, [term, term], (err, result) => {
            if (err) {
                res.redirect("./");
            }

            let allData = Object.assign([], forumData, { membership: result });
            res.render("topic-info", allData);
        });
    });

    // Add a New Post page
    app.get("/addpost", function (req, res) {
        // Set the initial values for the form
        let initialvalues = { username: "", topic: "", title: "", content: "" };

        // Pass the data to the EJS page and view it
        return renderAddNewPost(res, initialvalues, "");
    });

    // Helper function to
    function renderAddNewPost(res, initialvalues, errormessage) {
        let data = Object.assign({}, forumData, initialvalues, {
            errormessage: errormessage,
        });
        console.log(data);
        res.render("addpost.ejs", data);
        return;
    }

    // Add a New Post page form handler
    app.post("/postadded", function (req, res) {
        let user_id = -1;
        let topic_id = -1;

        // Get the user id from the user name
        let params = [
            req.body.title,
            req.body.content,
            req.body.topic,
            req.body.username,
        ];
        let sqlquery = `CALL addpost(?,?,?,?)`;
        db.query(sqlquery, params, (err, result) => {
            if (err) {
                return renderAddNewPost(res, req.body, err.message);
            }
            res.send("Your post has been added to the forum");
        });
    });

    // Search for Posts page
    app.get("/search", function (req, res) {
        res.render("search.ejs", forumData);
    });

    // Search for Posts form handler
    app.post("/viewposts", function (req, res) {
        //searching in the database
        let term = "%" + req.body.keyword + "%";
        let sqlquery = `SELECT *
                        FROM   posts p
                        JOIN topics t
                        ON t.topic_id = p.topic_id
                        JOIN users u
                        ON u.user_id = p.user_id
                        WHERE  post_title LIKE ? OR post_content LIKE ?`;

        db.query(sqlquery, [term, term], (err, result) => {
            if (err) {
                res.redirect("./");
            }

            let allData = Object.assign([], forumData, { posts: result });

            res.render("viewposts", allData);
        });
    });

    app.get("/register", (req, res) => {
        res.render("register.ejs", forumData);
    });

    app.post("/register", (req, res) => {
        const { u_name, pass } = req.body;
        db.query(
            "INSERT INTO credentials (username, password) VALUES (?, ?)",
            [username, password],
            (error, results) => {
                if (error) throw error;
                res.redirect("login");
            }
        );
    });
};

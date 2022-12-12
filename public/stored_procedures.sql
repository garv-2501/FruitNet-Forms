DELIMITER $$
USE myforum$$
CREATE PROCEDURE addpost (
    IN post_date varchar(50), 
    IN post_title varchar(50), 
    IN post_content varchar(50), 
    IN user_id int, IN topic_id int)
BEGIN
    INSERT INTO posts (post_date, post_title, post_content, user_id, topic_id) VALUES (post_date, post_title, post_content, user_id, topic_id);
END $$
DELIMITER ;



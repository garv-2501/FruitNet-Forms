DELIMITER //
USE myforum //
CREATE PROCEDURE addpost (
    IN in_post_title varchar(30), 
    IN in_post_content MEDIUMTEXT, 
    IN in_topic_title varchar(20), 
    IN in_username varchar(15))
BEGIN
    -- Declaring variables
    DECLARE out_user_id int;
    DECLARE out_topic_id int;
    DECLARE out_user_is_member int;

    -- First round for out_user_id
    SELECT user_id
    From users
    WHERE username = in_username
    INTO out_user_id;

    IF ISNULL(out_user_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "No matchine username found!";
    END IF;

    -- Second round for out_topic_id
    SELECT topic_id
    From topics
    WHERE topic_title = in_topic_title
    INTO out_topic_id;

    IF ISNULL(out_topic_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "No matchine topic found!";
    END IF;

    -- Third round for out_user_is_member
    SELECT count(*) AS countmembership
    From membership
    WHERE user_id = out_user_id AND topic_id = out_topic_id
    INTO out_user_is_member;

    IF out_user_is_member=0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "User is not a member of that topic!";
    END IF;


    INSERT INTO posts (
        post_date, 
        post_title, 
        post_content, 
        user_id, 
        topic_id) 
    VALUES (
        now(), 
        in_post_title, 
        in_post_content, 
        out_user_id, 
        out_topic_id);
END //
DELIMITER ;



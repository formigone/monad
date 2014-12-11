CREATE TABLE monadAd (
  id          INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  image       VARCHAR(512) NOT NULL,
  question    VARCHAR(512) NOT NULL,
  validPoints TEXT         NOT NULL
) ENGINE =innodb;

INSERT INTO monadAd (image, question, validPoints) VALUES
('http://media.ksl.com/monad-001.jpg', 'Click or tap on the license plate', '496,243,576,274'),
('http://media.ksl.com/monad-001.jpg', 'Click or tap on the big, huge Porsche logo', '37,17,624,121'),
('http://media.ksl.com/monad-001.jpg', "Click or tap on that dude's happy face", '302,149,335,185'),
('http://media.ksl.com/monad-002.jpg', "Click or tap on Paige Davis' face", '364,20,514,200'),
('http://media.ksl.com/monad-002.jpg', "Click or tap on the chimney on that logo", '227,17,265,55');

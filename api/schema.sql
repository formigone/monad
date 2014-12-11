CREATE TABLE monadAd (
  id          INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  image       VARCHAR(512) NOT NULL,
  question    VARCHAR(512) NOT NULL,
  validPoints TEXT         NOT NULL
) ENGINE =innodb;

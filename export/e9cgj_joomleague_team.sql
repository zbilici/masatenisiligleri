# Host: localhost  (Version 5.5.5-10.4.22-MariaDB)
# Date: 2025-03-27 23:03:20
# Generator: MySQL-Front 6.0  (Build 2.20)


#
# Structure for table "e9cgj_joomleague_team"
#

DROP TABLE IF EXISTS `e9cgj_joomleague_team`;
CREATE TABLE `e9cgj_joomleague_team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `club_id` int(11) DEFAULT NULL,
  `name` varchar(75) NOT NULL DEFAULT '',
  `short_name` varchar(15) NOT NULL DEFAULT '',
  `middle_name` varchar(25) NOT NULL DEFAULT '',
  `alias` varchar(255) NOT NULL DEFAULT '',
  `website` varchar(250) NOT NULL DEFAULT '',
  `info` varchar(255) NOT NULL DEFAULT '',
  `notes` text NOT NULL,
  `picture` varchar(128) NOT NULL DEFAULT '',
  `extended` text DEFAULT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `checked_out` int(10) NOT NULL DEFAULT 0,
  `modified` datetime DEFAULT NULL,
  `modified_by` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `club_id` (`club_id`),
  KEY `fk_club` (`club_id`)
) ENGINE=MyISAM AUTO_INCREMENT=370 DEFAULT CHARSET=utf8;

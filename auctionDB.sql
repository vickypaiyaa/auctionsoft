-- Table: categories

-- DROP TABLE categories;
CREATE TABLE categories
(
  cid serial NOT NULL,
  category_name character varying(50),
  created_on timestamp without time zone,
  last_login timestamp without time zone,
  CONSTRAINT categories_pkey PRIMARY KEY (cid )
)
WITH (
  OIDS=FALSE
);
ALTER TABLE categories
  OWNER TO postgres;

-- Table: patients

-- DROP TABLE patients;
CREATE TABLE patients
(
  id serial NOT NULL,
  name character varying(50),
  email character varying(200),
  created_on timestamp without time zone,
  last_login timestamp without time zone,
  CONSTRAINT patients_pkey PRIMARY KEY (id )
)
WITH (
  OIDS=FALSE
);
ALTER TABLE patients
  OWNER TO postgres;
GRANT ALL ON TABLE patients TO postgres;

-- Table: projects

-- DROP TABLE projects;
CREATE TABLE projects
(
  id serial NOT NULL,
  project_name character varying(50),
  user_id integer,
  cid integer,
  created_on timestamp without time zone,
  last_login timestamp without time zone,
  CONSTRAINT projects_pkey PRIMARY KEY (id )
)
WITH (
  OIDS=FALSE
);
ALTER TABLE projects
  OWNER TO postgres;

-- Table: users

-- DROP TABLE users;
CREATE TABLE users
(
  user_id serial NOT NULL,
  username character varying(50),
  password character varying(100),
  created_on timestamp without time zone,
  last_login timestamp without time zone,
  CONSTRAINT users_pkey PRIMARY KEY (user_id )
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO postgres;

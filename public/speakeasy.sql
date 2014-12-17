CREATE TABLE users (
    userid serial primary key,
    username text,
    password text,
    name text,
    email text,
    signup timestamp default now()
);

CREATE TABLE clips (
    title text,
    description text,
    userid int references users(userid),
    clipid serial primary key,
    content text,
    createddate timestamp default now()
);

CREATE TABLE replies (
    clipid int references clips(clipid),
    userid int references users(userid),
    content text,
    createddate timestamp default now()
);

CREATE TABLE likes (
    clipid int references clips(clipid),
    userid int references users(userid)
);

CREATE TABLE shares (
    clipid int references clips(clipid),
    userid int references users(userid),
    comment text,
    createddate timestamp default now()
);

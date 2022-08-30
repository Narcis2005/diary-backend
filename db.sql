
-- table users
CREATE TABLE IF NOT EXISTS public.users
(
    id serial,
    email character varying(200) COLLATE pg_catalog."default" NOT NULL,
    username character varying(200) COLLATE pg_catalog."default",
    password character varying(300) COLLATE pg_catalog."default",
    "fullName" character varying(255) COLLATE pg_catalog."default",
    "imagePath" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
-- table "diaryEntries"
CREATE TABLE IF NOT EXISTS public."diaryEntries"
(
    id serial,
    "userId" integer,
    content text COLLATE pg_catalog."default",
    "createdAt" date,
    "updatedAt" date,
    CONSTRAINT "diaryEntry_pkey" PRIMARY KEY (id),
    CONSTRAINT "userId" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

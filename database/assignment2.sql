-- 1 Inserting and Deleting data from `account` table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) 
	VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2 Modifying data from the `account` table
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';

-- 3 Deleting data from `account` table
DELETE FROM public.account
WHERE account_id = 1;

-- 4 Modifying strings from `inv_descriptiong in the `inventory` table
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5 Joining `inventory` make and model with `classification` name using INNER JOIN
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
	INNER JOIN public.classification c
		ON i.classification_id = c.classification_id
		WHERE c.classification_name = 'Sport';

-- 6 Replacing strings from the `inventory` images and thumbnails columns to add a vehicles path
UPDATE public.inventory
SET	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


const express = require('express');
const router = express.Router();
const db = require('../data/helper/activitiesModal');
const { authenticate } = require('../auth/auth');
const userDB = require('../data/helper/userModal');

router.get('/', authenticate, (req, res) => {
	userDB
		.findUserName(req.decoded.username)
		.then((res) => db.getActivities(res.id))
		.then((activities) => res.status(200).json(activities))
		.catch((err) => {
			res.status(500).json(`Server error: ${err}`);
		});
});

router.get('/:id', authenticate, (req, res) => {
	const { id } = req.params;
	db
		.getActivity(id)
		.then((activity) => {
			if (activity) {
				res.status(200).json(activity);
			} else {
				res.status(404).json({ error: 'Activity not found' });
			}
		})
		.catch((err) => {
			res.status(500).json(`Server error: ${err}`);
		});
});

router.post('/', authenticate, (req, res, next) => {
	const activity = req.body;
	db
		.createActivity(activity)
		.then((ids) => {
			db
				.getActivity(ids[0])
				.then((activity) => {
					res.status(201).json({ activity: activity.id });
				})
				.catch((err) => {
					res.status(500).json(`Server error: ${err}`);
				});
		})
		.catch((err) => {
			next('h500', err);
		});
});

router.delete('/:id', authenticate, (req, res) => {
	const { id } = req.params;
	db
		.deleteActivity(id)
		.then((activity) => {
			if (activity) {
				res.status(202).json({ message: 'Activity deleted' });
			} else {
				res.status(404).json({ errorMessage: 'That activity seems to be missing!' });
			}
		})
		.catch((err) => res.status(500).json(`Server error: ${err}`));
});

router.put('/:id', authenticate, (req, res, next) => {
	const { id } = req.params;
	const { name, fk, energyLevel, enjoymentRating, engagement } = req.body;
	const edit = { name, fk, energyLevel, enjoymentRating, engagement };
	db
		.editActivity(id, edit)
		.then((ids) => {
			if (ids) {
				res.status(200).json({
					message: 'Activity updated',
					activity: ids[0]
				});
			} else {
				res.status(404).json({ errorMessage: 'That activity seems to be missing!' });
			}
		})
		.catch((err) => {
			next('h500', err);
		});
});

module.exports = router;

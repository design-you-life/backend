const express = require('express');
const router = express.Router();
const db = require('../data/helper/activitiesModal');

router.get('/', (req, res) => {
	db.getActivities().then((activities) => res.status(200).json(activities)).catch((err) => {
		res.status(500).json(`Server error: ${err}`);
	});
});

router.get('/:id', (req, res) => {
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

router.post('/', (req, res) => {
	const activity = req.body;
	db
		.insert(activity)
		.then((activity) => {
			res.status(201).json(activity);
		})
		.catch((err) => {
			res.status(500).json(`Server error: ${err}`);
		});
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;
	db
		.deleteActivity(id)
		.then((res) => {
			if (res) {
				res.status(202).json({ message: 'Activity deleted' });
			} else {
				res.status(404).json({ errorMessage: 'That activity seems to be missing!' });
			}
		})
		.catch((err) => res.status(500).json(`Server error: ${err}`));
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { name, fk, energyLevel, enjoymentLevel, engagement } = req.body;
	const edit = { name, fk, energyLevel, enjoymentLevel, engagement };

	db
		.update(id, edit)
		.then((edit) => {
			if (edit) {
				res.status(200).json({
					message: 'Activity updated ',
					activity: edit
				});
			} else {
				res.status(404).json({ errorMessage: 'That activity seems to be missing!' });
			}
		})
		.catch((err) => res.status(500).json(`Server error: ${err}`));
});

module.exports = router;

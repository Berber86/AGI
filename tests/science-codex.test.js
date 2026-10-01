const test = require('node:test');
const assert = require('node:assert/strict');
const Campaign = require('../campaign.js');

/* Правила кодекса проектов: дубликаты не принимаются, приём замысла — это
   дневной приказ «Исследование», а неиспользованный проект можно убрать. */

const SEED = Campaign.SEED_CHOICES.find(choice => choice.id === 'river');

function stateWithOffers() {
  const state = Campaign.createState(SEED);
  state.player.onboardingComplete = true;
  state.player.scienceChoices = {
    branchId: 'advisor',
    day: state.day,
    projects: [
      { scienceName: 'Террасные поля', scienceDescription: 'Склоны держат воду.', buildingName: 'Ступени у воды', buildingDescription: 'Земляные ступени под ячмень.', category: 'economy', effects: [{ type: 'income_food', amount: 1 }] },
      { scienceName: 'Счёт звёзд', scienceDescription: 'Народ считает ночи.', buildingName: 'Лунный круг', buildingDescription: 'Камень с двенадцатью столбами.', category: 'science', effects: [{ type: 'income_knowledge', amount: 1 }] },
      { scienceName: 'Ограда и дозор', scienceDescription: 'Частокол отделяет своё от чужого.', buildingName: 'Вал с частоколом', buildingDescription: 'Земляной вал в брёвнах.', category: 'military', effects: [{ type: 'max_hp', amount: 1 }] },
    ],
  };
  return Campaign.normalizeState(state);
}

test('приём замысла тратит приказ «Исследование» и оставляет остальные замыслы', () => {
  const state = stateWithOffers();
  assert.equal(state.player.dailyOrders.researchUsed, false);
  const apBefore = state.player.ap;

  const accepted = Campaign.acceptScienceProject(state, 0);
  assert.equal(accepted.error, null);
  assert.equal(accepted.state.player.dailyOrders.researchUsed, true);
  assert.equal(accepted.state.player.ap, apBefore - 1);
  assert.equal(accepted.state.player.blueprints[0].scienceName, 'Террасные поля');
  assert.equal(accepted.state.player.scienceChoices.projects.length, 2);
  assert.ok(accepted.state.player.chronicle.length > 0);
});

test('изучение науки и приём замысла делят один приказ дня', () => {
  let state = stateWithOffers();
  const known = Campaign.addBlueprint(state, {
    scienceName: 'Обжиг глины', scienceDescription: 'Печь держит жар.', buildingName: 'Обжиговая мастерская',
    buildingDescription: 'Керамика выходит крепкой.', category: 'economy', effects: [{ type: 'income_materials', amount: 1 }],
  }, 'both');
  assert.equal(known.error, null);
  const researched = Campaign.researchBlueprint(known.state, known.blueprint.id);
  assert.equal(researched.error, null);

  const blocked = Campaign.acceptScienceProject(researched.state, 0);
  assert.match(blocked.error, /исследование уже проведено/i);
  assert.equal(blocked.state.player.blueprints.some(b => b.scienceName === 'Террасные поля'), false);
});

test('советник не может продать одну и ту же науку дважды', () => {
  const state = stateWithOffers();
  const accepted = Campaign.acceptScienceProject(state, 0);
  assert.equal(accepted.error, null);

  const duplicate = Campaign.addBlueprint(accepted.state, {
    scienceName: 'террасные ПОЛЯ', scienceDescription: 'То же самое.', buildingName: 'Другие ступени',
    buildingDescription: 'Другая постройка.', category: 'economy', effects: [{ type: 'income_food', amount: 1 }],
  }, 'both');
  assert.match(duplicate.error, /уже есть в кодексе/i);

  const sameBuilding = Campaign.addBlueprint(accepted.state, {
    scienceName: 'Совсем другая наука', scienceDescription: 'Другое описание.', buildingName: 'Ступени у воды',
    buildingDescription: 'Та же постройка.', category: 'economy', effects: [{ type: 'income_food', amount: 1 }],
  }, 'both');
  assert.match(sameBuilding.error, /уже есть в кодексе/i);
});

test('неизученный проект можно убрать, изученный и первое дело — нельзя', () => {
  const state = stateWithOffers();
  const accepted = Campaign.acceptScienceProject(state, 0);
  const blueprintId = accepted.state.player.blueprints[0].id;

  const removed = Campaign.removeBlueprint(accepted.state, blueprintId);
  assert.equal(removed.error, null);
  assert.equal(removed.state.player.blueprints.some(b => b.id === blueprintId), false);

  const opening = Campaign.createState(SEED);
  opening.player.onboardingComplete = true;
  opening.player.blueprints = [{ id: 'opening', scienceName: 'Первое дело', buildingName: 'Первая постройка', openingProject: true, effects: [{ type: 'income_food', amount: 1 }] }];
  const openingRemoval = Campaign.removeBlueprint(Campaign.normalizeState(opening), 'opening');
  assert.match(openingRemoval.error, /первое дело/i);
});

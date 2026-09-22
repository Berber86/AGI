export interface GearSetDefinition {
  id: string;
  name: string;
  tagline: string;
  color: string;
  twoPieceBonus: {
    description: string;
    attackBonus?: number;
    defenseBonus?: number;
    critBonus?: number;
    speedBonus?: number;
    maxHpBonus?: number;
  };
  threePieceBonus: {
    description: string;
    specialEffect: string;
    attackPercent?: number;
    damageReductionPercent?: number;
    allStatsBonus?: number;
  };
}

export const GEAR_SETS: Record<string, GearSetDefinition> = {
  steamforged: {
    id: 'steamforged',
    name: 'Паровой Легион',
    tagline: 'Выкованные под чудовищным давлением клапаны',
    color: '#da9d78',
    twoPieceBonus: {
      description: '+12 к Защите и +40 к Макс. HP',
      defenseBonus: 12,
      maxHpBonus: 40,
    },
    threePieceBonus: {
      description: '«Паровой Всплеск»: Внезапная атака наносит 150% урона и дает щит на 50 HP',
      specialEffect: 'steam_burst',
      damageReductionPercent: 15,
    },
  },
  clockwork_dragon: {
    id: 'clockwork_dragon',
    name: 'Заводной Дракон',
    tagline: 'Огненные зубья и шестерни с зазубринами',
    color: '#ef4444',
    twoPieceBonus: {
      description: '+18 к Атаке и +15% к Шансу Крита',
      attackBonus: 18,
      critBonus: 0.15,
    },
    threePieceBonus: {
      description: '«Драконье Пламя»: Критические удары поджигают цель (25 урона в раунд)',
      specialEffect: 'ignite_burn',
      attackPercent: 20,
    },
  },
  titan_guard: {
    id: 'titan_guard',
    name: 'Оплот Титана',
    tagline: 'Тяжелый чугун имперских доков',
    color: '#60a5fa',
    twoPieceBonus: {
      description: '+70 к Макс. HP и +15 к Защите',
      defenseBonus: 15,
      maxHpBonus: 70,
    },
    threePieceBonus: {
      description: '«Несокрушимость»: Снижает весь входящий урон на 25%',
      specialEffect: 'titan_bastion',
      damageReductionPercent: 25,
    },
  },
  void_core: {
    id: 'void_core',
    name: 'Шестерни Бездны',
    tagline: 'Искривленные хроно-механизмы вне времени',
    color: '#c084fc',
    twoPieceBonus: {
      description: '+8 к Скорости и +20% к Уклонению',
      speedBonus: 8,
    },
    threePieceBonus: {
      description: '«Хроно-сдвиг»: Первый смертельный удар оставляет 1 HP и восстанавливает 30% духа',
      specialEffect: 'chrono_shift',
      allStatsBonus: 10,
    },
  },
  alchemical_order: {
    id: 'alchemical_order',
    name: 'Алхимический Орден',
    tagline: 'Ртутные поршни и ядовитые инжекторы',
    color: '#34d399',
    twoPieceBonus: {
      description: '+10 к Атаке, атаки накладывают 1 заряд Яда',
      attackBonus: 10,
    },
    threePieceBonus: {
      description: '«Ртутный Каскад»: Яд взрывается при накоплении 3 зарядов, оглушая цель',
      specialEffect: 'alchemical_burst',
      attackPercent: 15,
    },
  },
};

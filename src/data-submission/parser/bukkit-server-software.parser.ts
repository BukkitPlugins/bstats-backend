import { Injectable, Logger } from '@nestjs/common';
import {
  SubmitDataCustomChartDto,
  SubmitDataDto,
} from '../dto/submit-data.dto';
import { Parser } from './interfaces/parser.interface';
import { DefaultChart } from '../../charts/interfaces/charts/default-chart.interface';

const serverSoftwareBrands = new Map<string, string>();
// Common server software
serverSoftwareBrands.set('spigot', 'Spigot'); // https://hub.spigotmc.org/stash/projects/SPIGOT/repos/spigot/browse
serverSoftwareBrands.set('paper', 'Paper'); // https://github.com/PaperMC/Paper
serverSoftwareBrands.set('purpur', 'Purpur'); // https://github.com/PurpurMC/Purpur
serverSoftwareBrands.set('folia', 'Folia'); // https://github.com/PaperMC/Folia
serverSoftwareBrands.set('mohist', 'Mohist'); // https://github.com/MohistMC/Mohist
serverSoftwareBrands.set('arclight', 'Arclight'); // https://github.com/IzzelAliz/Arclight
serverSoftwareBrands.set('pufferfish', 'Pufferfish'); // https://github.com/pufferfish-gg/Pufferfish
serverSoftwareBrands.set('leaves', 'Leaves'); // https://github.com/LeavesMC/Leaves
serverSoftwareBrands.set('leaf', 'Leaf'); // https://github.com/Winds-Studio/Leaf
serverSoftwareBrands.set('gale', 'Gale'); // https://github.com/GaleMC/Gale | https://github.com/Dreeam-qwq/Gale
serverSoftwareBrands.set('scissors', 'Scissors'); // https://github.com/AtlasMediaGroup/Scissors
serverSoftwareBrands.set('catserver', 'CatServer'); // https://github.com/Luohuayu/CatServer/


// Some obscure shit
serverSoftwareBrands.set('axolotl', 'AxolotlSpigot'); // https://www.axolotlspigot.com/
serverSoftwareBrands.set('axolotl', 'Axolotl'); // https://www.axolotlspigot.com/
serverSoftwareBrands.set('universespigot', 'UniverseSpigot'); // https://www.axolotlspigot.com/
serverSoftwareBrands.set('divinemc', 'DivineMC'); // https://github.com/DivineMC/DivineMC
serverSoftwareBrands.set('shreddedpaper', 'ShreddedPaper'); // https://github.com/MultiPaper/ShreddedPaper
serverSoftwareBrands.set('plazma', 'Plazma'); // https://github.com/PlazmaMC/PlazmaBukkit
serverSoftwareBrands.set('advancedslimepaper', 'AdvancedSlimePaper'); // https://github.com/InfernalSuite/AdvancedSlimePaper
serverSoftwareBrands.set('slimeworldmanager', 'SlimeWorldManager');

// Outdated shit
serverSoftwareBrands.set('glowstone', 'Glowstone'); // https://github.com/GlowstoneMC/Glowstone, EOL
serverSoftwareBrands.set('titanium', 'Titanium'); // https://github.com/Mythic-Projects/Titanium, EOL
serverSoftwareBrands.set('magma', 'Magma'); // https://github.com/magmafoundation/Magma, EOL
serverSoftwareBrands.set('yatopia', 'Yatopia'); // https://github.com/YatopiaMC/Yatopia, EOL
serverSoftwareBrands.set('airplane', 'Airplane'); // https://github.com/TECHNOVE/Airplane, EOL
serverSoftwareBrands.set('tuinity', 'Tuinity'); // https://github.com/Tuinity/Tuinity, EOL
serverSoftwareBrands.set('lava', 'Lava'); // https://github.com/Timardo/Lava, EOL
serverSoftwareBrands.set('taco', 'TacoSpigot'); // https://github.com/TacoSpigot/TacoSpigot, EOL
serverSoftwareBrands.set('bukkit', 'Bukkit'); // https://github.com/Bukkit/Bukkit, EOL

@Injectable()
export class BukkitServerSoftwareParser implements Parser {
  private readonly logger = new Logger(BukkitServerSoftwareParser.name);

  parse(
    chart: DefaultChart,
    submitDataDto: SubmitDataDto,
    requestRandom: number,
  ): SubmitDataCustomChartDto[] | null {
    const { bukkitVersion, bukkitName } = submitDataDto;

    if (typeof bukkitVersion !== 'string') {
      return null;
    }

    // If it doesn't contain "MC: ", it's from an old bStats Metrics class
    if (bukkitVersion.indexOf('MC:') === -1) {
      return null;
    }

    let softwareName = 'Unknown';

    // First try to find the software name based on the bukkit version
    const lowercaseBukkitVersion = bukkitVersion.toLowerCase();
    for (const [brand, name] of serverSoftwareBrands.entries()) {
      if (lowercaseBukkitVersion.indexOf(brand) !== -1) {
        softwareName = name;
        break;
      }
    }

    // then try to find the software name based on the bukkit name
    if (softwareName === 'Unknown' && typeof bukkitName === 'string') {
      const lowercaseBukkitName = bukkitName.toLowerCase();
      const maybeSoftwareName = serverSoftwareBrands.get(lowercaseBukkitName);
      if (maybeSoftwareName) {
        softwareName = maybeSoftwareName;
      }
    }

    // ultimately we log a message for further investigation
    if (softwareName === 'Unknown') {
      this.logger.log(
        'Unknown server software: bukkitVersion="' +
          bukkitVersion +
          '", bukkitName="' +
          bukkitName +
          '"',
      );
    }

     // ultimately we log a message for further investigation
     if (softwareName === 'Unknown') {
      this.logger.log(
        'Unknown server software: bukkitVersion="' +
          bukkitVersion +
          '"',
      );
    }

    return [
      new SubmitDataCustomChartDto(
        chart.idCustom,
        { value: softwareName },
        requestRandom,
      ),
    ];
  }
}

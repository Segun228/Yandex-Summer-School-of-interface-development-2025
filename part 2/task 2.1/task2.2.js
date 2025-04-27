//пишем недо-генератор пакетов для ШРИ (где тут интерфейсы я не знаю)
function solution(config, vfs){
    if(!config.packageName){//проверяем наличие пакета
        throw new Error('Package name is required');
    }
    if(!config.referencePackage){//проверяем наличие пакета-образца
        throw new Error('Reference package is required');
    }
    const referencePackagePath = `packages/${config.referencePackage}`;//чекаем существует ли пакет-образец
    if(!vfs.existsSync(referencePackagePath)){
        throw new Error('Reference package not found');
    }
    const newPackagePath = `packages/${config.packageName}`;//проверяем, чтоб такой пакет уже не существовал
    if(vfs.existsSync(newPackagePath)){
        throw new Error('Package with such name already exists');
    }
    vfs.mkdirSync(newPackagePath);//создаем директории под наш пакетище
    vfs.mkdirSync(`${newPackagePath}/src`);
    const referencePackageJsonPath = `${referencePackagePath}/package.json`;//директория под джейсон нашего пакета
    const referencePackageJson = JSON.parse(vfs.readFileSync(referencePackageJsonPath));
    const newPackageJson={//собираем джейсон
        name: config.packageName,
        version: '1.0.0',
        description: config.description || '',
        license: referencePackageJson.license || 'ISC',
        main: referencePackageJson.main || 'src/index.ts',
        scripts: {},
    };
    const defaultScripts={// дефолтные настройки скриптов
        lint: 'eslint --ext .js,.jsx ./src',
        prettier: 'pnpm exec prettier',
        unit: 'jest',
    };
    const moduleScripts={
        eslint: 'lint',
        prettier: 'prettier',
        jest: 'unit',
    };
    if (config.modules){//собираем каждый модуль по отдельности, если такого модуля или директории нет, то скипаем
        for(const [moduleName, modulePath] of Object.entries(config.modules)){
            if(!modulePath){
                continue;
            }
            const fullPath = `packages/${modulePath}`;
            if(!vfs.existsSync(fullPath)){
                continue;
            }
            const fileName = modulePath.split('/').pop();
            vfs.copyFileSync(fullPath, `${newPackagePath}/${fileName}`);
            if(moduleScripts[moduleName]){
                const scriptName = moduleScripts[moduleName];
                newPackageJson.scripts[scriptName] = referencePackageJson.scripts?.[scriptName] || defaultScripts[scriptName];
            }
        }
    }
    vfs.writeFileSync(//записываем наш получившийся джейсон обратно в виде строки
        `${newPackagePath}/package.json`,
        JSON.stringify(newPackageJson)
    );
}
module.exports = solution;
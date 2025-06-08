import os
import re

def replace_urls_in_file(file_path):
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 定义正则表达式模式
    pattern = re.compile(r'/resource/(.*)')

    # 替换函数
    def replacer(match):
        # 只替换匹配部分的第一个斜杠之后的部分
        path_part = match.group(1).replace('/', '_')
        return f'/resource_{path_part}'

    # 执行替换
    new_content = pattern.sub(replacer, content)

    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(new_content)

def walk_directory(directory):
    for root, dirs, files in os.walk(directory):
        for name in files:
            if name.endswith('.ts'):  # 只处理 .ts 文件
                file_path = os.path.join(root, name)
                print(f'Processing {file_path}')
                replace_urls_in_file(file_path)

if __name__ == '__main__':
    target_directory = './'  # 当前目录
    walk_directory(target_directory)
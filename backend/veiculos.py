import pymysql
from db_config import connect_db
from flask import jsonify, request, Blueprint
from flask_cors import CORS
import re

# Cria o blueprint e ativa CORS só para ele
veiculos_bp = Blueprint("veiculos", __name__)
CORS(veiculos_bp, origins=["http://localhost:3000"])

def validar_veiculo(data):
    """Valida os dados do veículo"""
    erros = []
    
    if not data.get('modelo') or len(data['modelo'].strip()) < 2:
        erros.append("Modelo deve ter pelo menos 2 caracteres")
    
    if not data.get('marca') or len(data['marca'].strip()) < 2:
        erros.append("Marca deve ter pelo menos 2 caracteres")
    
    if not data.get('ano') or not str(data['ano']).isdigit():
        erros.append("Ano deve ser um número válido")
    elif int(data['ano']) < 1900 or int(data['ano']) > 2030:
        erros.append("Ano deve estar entre 1900 e 2030")
    
    if not data.get('cor') or len(data['cor'].strip()) < 2:
        erros.append("Cor deve ter pelo menos 2 caracteres")
    
    if not data.get('preco') or not isinstance(data['preco'], (int, float)) or data['preco'] <= 0:
        erros.append("Preço deve ser um número positivo")
    
    return erros

# GET todos os veículos com paginação e busca
@veiculos_bp.route('/veiculos', methods=['GET'])
def listar_veiculos():
    try:
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Parâmetros de busca e paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '').strip()
        
        # Construir query com busca
        query = "SELECT * FROM veiculos"
        params = []
        
        if search:
            query += " WHERE modelo LIKE %s OR marca LIKE %s OR cor LIKE %s"
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])
        
        # Adicionar ordenação
        query += " ORDER BY id DESC"
        
        # Adicionar paginação
        offset = (page - 1) * per_page
        query += " LIMIT %s OFFSET %s"
        params.extend([per_page, offset])
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        # Contar total de registros para paginação
        count_query = "SELECT COUNT(*) as total FROM veiculos"
        if search:
            count_query += " WHERE modelo LIKE %s OR marca LIKE %s OR cor LIKE %s"
            cursor.execute(count_query, [f"%{search}%", f"%{search}%", f"%{search}%"])
        else:
            cursor.execute(count_query)
        
        total = cursor.fetchone()['total']
        
        return jsonify({
            'veiculos': rows,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'pages': (total + per_page - 1) // per_page
            }
        }), 200
        
    except Exception as e:
        print(f"Erro ao listar veículos: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

# GET veículo por ID
@veiculos_bp.route('/veiculos/<int:id>', methods=['GET'])
def buscar_veiculo(id):
    try:
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM veiculos WHERE id = %s", (id,))
        row = cursor.fetchone()
        
        if row:
            return jsonify(row), 200
        else:
            return jsonify({'error': 'Veículo não encontrado'}), 404
            
    except Exception as e:
        print(f"Erro ao buscar veículo {id}: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

# POST novo veículo
@veiculos_bp.route('/veiculos', methods=['POST'])
def criar_veiculo():
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Validar dados
        erros = validar_veiculo(data)
        if erros:
            return jsonify({'error': 'Dados inválidos', 'details': erros}), 400
        
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        cursor.execute("""
            INSERT INTO veiculos (modelo, marca, ano, cor, preco) 
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data['modelo'].strip(),
            data['marca'].strip(),
            int(data['ano']),
            data['cor'].strip(),
            float(data['preco'])
        ))
        
        conn.commit()
        novo_id = cursor.lastrowid
        
        # Retornar o veículo criado
        cursor.execute("SELECT * FROM veiculos WHERE id = %s", (novo_id,))
        veiculo_criado = cursor.fetchone()
        
        return jsonify({
            'message': 'Veículo cadastrado com sucesso',
            'veiculo': veiculo_criado
        }), 201
        
    except Exception as e:
        print(f"Erro ao criar veículo: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

# PUT atualizar veículo
@veiculos_bp.route('/veiculos/<int:id>', methods=['PUT'])
def atualizar_veiculo(id):
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Validar dados
        erros = validar_veiculo(data)
        if erros:
            return jsonify({'error': 'Dados inválidos', 'details': erros}), 400
        
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Verificar se o veículo existe
        cursor.execute("SELECT id FROM veiculos WHERE id = %s", (id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Veículo não encontrado'}), 404
        
        cursor.execute("""
            UPDATE veiculos 
            SET modelo = %s, marca = %s, ano = %s, cor = %s, preco = %s 
            WHERE id = %s
        """, (
            data['modelo'].strip(),
            data['marca'].strip(),
            int(data['ano']),
            data['cor'].strip(),
            float(data['preco']),
            id
        ))
        
        conn.commit()
        
        # Retornar o veículo atualizado
        cursor.execute("SELECT * FROM veiculos WHERE id = %s", (id,))
        veiculo_atualizado = cursor.fetchone()
        
        return jsonify({
            'message': 'Veículo atualizado com sucesso',
            'veiculo': veiculo_atualizado
        }), 200
        
    except Exception as e:
        print(f"Erro ao atualizar veículo {id}: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

# DELETE veículo
@veiculos_bp.route('/veiculos/<int:id>', methods=['DELETE'])
def deletar_veiculo(id):
    try:
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Verificar se o veículo existe
        cursor.execute("SELECT id FROM veiculos WHERE id = %s", (id,))
        if not cursor.fetchone():
            return jsonify({'error': 'Veículo não encontrado'}), 404
        
        cursor.execute("DELETE FROM veiculos WHERE id = %s", (id,))
        conn.commit()
        
        return jsonify({'message': 'Veículo deletado com sucesso'}), 200
        
    except Exception as e:
        print(f"Erro ao deletar veículo {id}: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

# GET estatísticas
@veiculos_bp.route('/veiculos/stats', methods=['GET'])
def estatisticas():
    try:
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Total de veículos
        cursor.execute("SELECT COUNT(*) as total FROM veiculos")
        total = cursor.fetchone()['total']
        
        # Preço médio
        cursor.execute("SELECT AVG(preco) as preco_medio FROM veiculos")
        preco_medio = cursor.fetchone()['preco_medio'] or 0
        
        # Veículo mais caro
        cursor.execute("SELECT * FROM veiculos ORDER BY preco DESC LIMIT 1")
        mais_caro = cursor.fetchone()
        
        # Veículo mais barato
        cursor.execute("SELECT * FROM veiculos ORDER BY preco ASC LIMIT 1")
        mais_barato = cursor.fetchone()
        
        # Contagem por marca
        cursor.execute("SELECT marca, COUNT(*) as quantidade FROM veiculos GROUP BY marca ORDER BY quantidade DESC")
        marcas = cursor.fetchall()
        
        return jsonify({
            'total_veiculos': total,
            'preco_medio': float(preco_medio),
            'mais_caro': mais_caro,
            'mais_barato': mais_barato,
            'marcas': marcas
        }), 200
        
    except Exception as e:
        print(f"Erro ao buscar estatísticas: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
